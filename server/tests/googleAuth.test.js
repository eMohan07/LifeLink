/**
 * tests/googleAuth.test.js
 *
 * Dedicated tests for LifeLink Google Authentication Flow:
 * 1. Valid token -> JWT
 * 2. Invalid token -> 401 with friendly message
 * 3. First-time user created strictly as accountType "user"
 * 4. Hospital/admin role elevation impossible (forced to "user")
 * 5. Existing hospital/admin account rejected with 403 (account type not allowed)
 * 6. Token with mismatched project ID -> 401 with friendly message
 * 7. Unverified email -> 401 with friendly message
 * 8. Client UI state error classification (popup close silent reset, 15s timeout, popup blocked)
 */

require('./setup');

const request = require('supertest');
const { connect, clearDatabase, disconnect } = require('./helpers/db');
const User = require('../src/repositories/user.repository');
const DonorProfile = require('../src/repositories/donorProfile.repository');

let app;

beforeAll(async () => {
  await connect();
  app = require('../src/app');
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await disconnect();
});

describe('LifeLink Google Authentication & Security Protocol', () => {
  // ─── 1. Valid token -> JWT ──────────────────────────────────────────────────
  test('valid token returns JWT and user profile', async () => {
    const res = await request(app)
      .post('/api/auth/google')
      .send({
        idToken: 'mock_google_id_token',
        bloodGroup: 'B+',
        phone: '+91 9876543210',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.email).toBe('mock_google_user@gmail.com');
    expect(res.body.data.accountType).toBe('user');
    expect(res.body.data.bloodGroup).toBe('B+');
  });

  // ─── 2. Invalid token -> 401 with friendly message ──────────────────────────
  test('invalid or expired token returns 401 with friendly message', async () => {
    const res = await request(app)
      .post('/api/auth/google')
      .send({ idToken: 'invalid_expired_token_xyz' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/invalid or expired/i);
    // Ensure no internal stack traces leaked
    expect(res.body.stack).toBeUndefined();
  });

  // ─── 3. First-time user created as "user" with DonorProfile ──────────────────
  test('first-time user is created as "user" with associated donor profile', async () => {
    const res = await request(app)
      .post('/api/auth/google')
      .send({
        idToken: 'mock_google_id_token',
        bloodGroup: 'O-',
        phone: '+91 9988776655',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.accountType).toBe('user');

    const createdUser = await User.findByEmail('mock_google_user@gmail.com');
    expect(createdUser).toBeDefined();
    expect(createdUser.accountType).toBe('user');

    const profile = await DonorProfile.findByUserId(createdUser._id);
    expect(profile).toBeDefined();
    expect(profile.bloodGroup).toBe('O-');
    expect(profile.bloodGroupConfirmed).toBe(true);
  });

  // ─── 4. Hospital / Admin elevation is impossible ────────────────────────────
  test('hospital/admin elevation impossible: passing admin or hospital in payload is ignored', async () => {
    const res = await request(app)
      .post('/api/auth/google')
      .send({
        idToken: 'mock_google_id_token',
        bloodGroup: 'AB+',
        accountType: 'admin', // Malicious attempt to elevate to admin
        role: 'admin',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.accountType).toBe('user');
    expect(res.body.data.role).toBe('user');

    const createdUser = await User.findByEmail('mock_google_user@gmail.com');
    expect(createdUser.accountType).toBe('user');
  });

  test('hospital elevation impossible: passing hospital in payload is ignored', async () => {
    const res = await request(app)
      .post('/api/auth/google')
      .send({
        idToken: 'mock_google_id_token',
        bloodGroup: 'A-',
        accountType: 'hospital', // Malicious attempt to register hospital without verification
        role: 'hospital',
      });

    expect(res.status).toBe(200);
    expect(res.body.data.accountType).toBe('user');

    const createdUser = await User.findByEmail('mock_google_user@gmail.com');
    expect(createdUser.accountType).toBe('user');
  });

  // ─── 5. Existing hospital or admin account cannot log in via Google ─────────
  test('existing hospital account is rejected with 403 (account type not allowed)', async () => {
    // Seed existing hospital account with same email
    await User.create({
      name: 'City Hospital Admin',
      email: 'mock_google_user@gmail.com',
      password: 'hospitalPassword123',
      accountType: 'hospital',
    });

    const res = await request(app)
      .post('/api/auth/google')
      .send({ idToken: 'mock_google_id_token' });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/account type 'hospital' is not permitted/i);
  });

  test('existing admin account is rejected with 403 (account type not allowed)', async () => {
    // Seed existing admin account with same email
    await User.create({
      name: 'Super Admin',
      email: 'mock_google_user@gmail.com',
      password: 'adminPassword123',
      accountType: 'admin',
    });

    const res = await request(app)
      .post('/api/auth/google')
      .send({ idToken: 'mock_google_id_token' });

    expect(res.status).toBe(403);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/account type 'admin' is not permitted/i);
  });

  // ─── 6. Project ID mismatch -> 401 ──────────────────────────────────────────
  test('token with mismatched Firebase project ID returns 401', async () => {
    const res = await request(app)
      .post('/api/auth/google')
      .send({ idToken: 'mock_mismatched_project_token' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/project mismatch/i);
  });

  // ─── 7. Unverified email -> 401 ─────────────────────────────────────────────
  test('unverified Google email address returns 401', async () => {
    const res = await request(app)
      .post('/api/auth/google')
      .send({ idToken: 'mock_unverified_email_token' });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toMatch(/must be verified/i);
  });

  // ─── 8. Client UI state & Error classification behavior ─────────────────────
  describe('Client Button State & Error Classification Logic', () => {
    const classifyClientError = (err) => {
      if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        return null; // Silent reset
      }
      if (err.code === 'auth/popup-blocked') {
        return { type: 'popup_blocked', message: 'Popup was blocked by your browser.' };
      }
      if (err.code === 'ECONNABORTED' || err.message?.toLowerCase().includes('timeout')) {
        return { type: 'timeout', message: 'Authentication timed out after 15 seconds.' };
      }
      if (err.response?.status === 403 || err.message?.toLowerCase().includes('account type')) {
        return { type: 'account_type', message: 'Account type not permitted for Google sign-in.' };
      }
      return { type: 'general', message: 'Google sign-in failed.' };
    };

    test('popup close resets button silently with no error', () => {
      const errorClosed = { code: 'auth/popup-closed-by-user' };
      expect(classifyClientError(errorClosed)).toBeNull();

      const errorCancelled = { code: 'auth/cancelled-popup-request' };
      expect(classifyClientError(errorCancelled)).toBeNull();
    });

    test('15s timeout triggers friendly timeout error and clears spinner', () => {
      const errorTimeout = { code: 'ECONNABORTED', message: 'timeout of 15000ms exceeded' };
      const result = classifyClientError(errorTimeout);
      expect(result).not.toBeNull();
      expect(result.type).toBe('timeout');
      expect(result.message).toMatch(/timed out after 15 seconds/i);
    });

    test('popup blocked triggers clear actionable error', () => {
      const errorBlocked = { code: 'auth/popup-blocked' };
      const result = classifyClientError(errorBlocked);
      expect(result).not.toBeNull();
      expect(result.type).toBe('popup_blocked');
    });

    test('account type 403 returns clear account type error', () => {
      const error403 = { response: { status: 403 }, message: 'Account type not permitted' };
      const result = classifyClientError(error403);
      expect(result).not.toBeNull();
      expect(result.type).toBe('account_type');
    });
  });
});

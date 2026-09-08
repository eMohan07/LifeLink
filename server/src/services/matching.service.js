const { isBloodCompatible } = require('../utils/bloodCompatibility');
const { calculateHaversineDistance } = require('../utils/geo');
const DonorProfile = require('../models/DonorProfile');
const BloodRequest = require('../models/BloodRequest');

const COOLDOWN_DAYS = 56; // 8 weeks standard blood donation cooldown

/**
 * Pure function: Calculates match score (0-100) and rationale for a single candidate donor against a request.
 * Can be unit tested independently of Express, MongoDB, or HTTP contexts.
 * 
 * @param {Object} request - Blood request object containing bloodGroup, location coordinates
 * @param {Object} donor - Donor profile object containing bloodGroup, location coordinates, lastDonationDate, isAvailable, age, healthFlags
 * @returns {Object} { donor, matchScore, breakDown, rationale }
 */
function scoreDonorForRequest(request, donor) {
  const reqGroup = request.bloodGroup;
  const donorGroup = donor.bloodGroup;

  // 1. Compatibility Check (Max 35 pts)
  let compatibilityScore = 0;
  if (!isBloodCompatible(donorGroup, reqGroup)) {
    return {
      donor,
      matchScore: 0,
      isCompatible: false,
      breakdown: { compatibilityScore: 0, availabilityScore: 0, geoScore: 0, eligibilityScore: 0 },
      rationale: [`Incompatible blood group (${donorGroup} cannot donate to ${reqGroup})`],
    };
  }

  if (donorGroup === reqGroup) {
    compatibilityScore = 35;
  } else {
    compatibilityScore = 25; // Compatible universal/cross donor
  }

  // 2. Availability & Cooldown Check (Max 25 pts)
  let availabilityScore = 0;
  const rationale = [];

  if (donor.isAvailable !== false) {
    availabilityScore += 15;
  } else {
    rationale.push('Donor status set to unavailable');
  }

  let daysSinceLastDonation = null;
  if (donor.lastDonationDate) {
    const lastDate = new Date(donor.lastDonationDate);
    const diffMs = Date.now() - lastDate.getTime();
    daysSinceLastDonation = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (daysSinceLastDonation >= COOLDOWN_DAYS) {
      availabilityScore += 10;
    } else {
      rationale.push(`In 56-day cooldown (${daysSinceLastDonation} days since last donation)`);
    }
  } else {
    // First time donor or no recorded date
    availabilityScore += 10;
  }

  // 3. Proximity Distance Score (Max 25 pts)
  let geoScore = 0;
  const reqCoords = request.location?.coordinates || [77.2090, 28.6139];
  const donorCoords = donor.location?.coordinates || [77.2090, 28.6139];
  const distanceKm = calculateHaversineDistance(reqCoords, donorCoords);

  if (distanceKm <= 5) {
    geoScore = 25;
  } else if (distanceKm <= 15) {
    geoScore = 20;
  } else if (distanceKm <= 30) {
    geoScore = 15;
  } else if (distanceKm <= 50) {
    geoScore = 10;
  } else {
    geoScore = 5;
  }

  // 4. Eligibility Check (Max 15 pts)
  let eligibilityScore = 0;
  const age = donor.age || 25;
  if (age >= 18 && age <= 65) {
    eligibilityScore += 10;
  } else {
    rationale.push(`Age ${age} outside optimal 18-65 range`);
  }

  const flags = donor.healthFlags || [];
  const disqualifyingFlags = ['active_infection', 'tattoos_recent', 'underweight', 'hepatitis'];
  const hasDisqualifying = flags.some(f => disqualifyingFlags.includes(f));

  if (!hasDisqualifying) {
    eligibilityScore += 5;
  } else {
    rationale.push(`Health flags present: ${flags.join(', ')}`);
  }

  const totalScore = compatibilityScore + availabilityScore + geoScore + eligibilityScore;

  return {
    donor,
    matchScore: totalScore,
    isCompatible: true,
    distanceKm,
    daysSinceLastDonation,
    breakdown: {
      compatibilityScore,
      availabilityScore,
      geoScore,
      eligibilityScore,
    },
    rationale: rationale.length > 0 ? rationale : ['Optimal match'],
  };
}

/**
 * Pure function: Ranks an array of candidate donors for a given request.
 * Returns sorted list by match score descending.
 */
function rankDonorsForRequest(request, candidateDonors) {
  if (!request || !candidateDonors || !Array.isArray(candidateDonors)) {
    return [];
  }

  const scoredDonors = candidateDonors
    .map(donor => scoreDonorForRequest(request, donor))
    .filter(res => res.isCompatible && res.matchScore > 20)
    .sort((a, b) => b.matchScore - a.matchScore);

  return scoredDonors;
}

/**
 * Service function: Fetches request and potential candidate donors from DB, scores and returns ranking.
 */
const findMatchesForRequestId = async (requestId, maxResults = 10) => {
  const request = await BloodRequest.findById(requestId);
  if (!request) {
    throw new Error('Blood request not found');
  }

  // Fetch candidate donors
  const candidateDonors = await DonorProfile.find()
    .populate('user', 'name email phone role');

  const rankedMatches = rankDonorsForRequest(request, candidateDonors);
  return {
    request,
    totalCandidateDonors: candidateDonors.length,
    matchesCount: rankedMatches.length,
    matches: rankedMatches.slice(0, maxResults),
  };
};

module.exports = {
  scoreDonorForRequest,
  rankDonorsForRequest,
  findMatchesForRequestId,
};

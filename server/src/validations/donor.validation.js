const { z } = require('zod');

const donorProfileSchema = z.object({
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  coordinates: z.array(z.number()).length(2, 'Coordinates must be [longitude, latitude]').optional(),
  address: z.string().optional().default(''),
  lastDonationDate: z.string().nullable().optional(),
  isAvailable: z.boolean().optional().default(true),
  age: z.number().min(18).max(65).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  healthFlags: z.array(z.string()).optional(),
  contactNumber: z.string().optional(),
});

module.exports = {
  donorProfileSchema,
};

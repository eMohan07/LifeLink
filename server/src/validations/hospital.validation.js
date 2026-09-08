const { z } = require('zod');

const inventoryItemSchema = z.object({
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  units: z.number().min(0, 'Units must be 0 or greater'),
});

const updateInventorySchema = z.object({
  inventory: z.array(inventoryItemSchema),
});

const hospitalProfileSchema = z.object({
  name: z.string().min(2),
  licenseNumber: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  coordinates: z.array(z.number()).length(2).optional(),
});

module.exports = {
  updateInventorySchema,
  hospitalProfileSchema,
};

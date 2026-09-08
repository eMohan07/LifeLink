/**
 * Red Blood Cell Compatibility Matrix
 * Key: Recipient Blood Group -> Value: Array of Compatible Donor Blood Groups
 */
const RECIPIENT_COMPATIBILITY = {
  'O-': ['O-'],
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
};

/**
 * Key: Donor Blood Group -> Value: Array of Compatible Recipient Blood Groups
 */
const DONOR_COMPATIBILITY = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'],
};

/**
 * Checks if a donor blood group can donate to a recipient blood group
 */
const isBloodCompatible = (donorBloodGroup, recipientBloodGroup) => {
  if (!donorBloodGroup || !recipientBloodGroup) return false;
  const compatibleDonors = RECIPIENT_COMPATIBILITY[recipientBloodGroup] || [];
  return compatibleDonors.includes(donorBloodGroup);
};

/**
 * Returns list of compatible donor blood groups for a given recipient
 */
const getCompatibleDonorGroups = (recipientBloodGroup) => {
  return RECIPIENT_COMPATIBILITY[recipientBloodGroup] || [];
};

module.exports = {
  RECIPIENT_COMPATIBILITY,
  DONOR_COMPATIBILITY,
  isBloodCompatible,
  getCompatibleDonorGroups,
};

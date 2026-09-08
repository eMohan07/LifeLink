const Notification = require('../models/Notification');
const DonorProfile = require('../models/DonorProfile');
const { isBloodCompatible } = require('../utils/bloodCompatibility');

/**
 * Creates in-app notifications for matched donors when a new emergency blood request is created
 */
const notifyMatchedDonorsForRequest = async (bloodRequest) => {
  if (!bloodRequest || !bloodRequest.bloodGroup) return { count: 0 };

  // Find candidate donors
  const donors = await DonorProfile.find({ isAvailable: true }).populate('user', 'name email phone');
  
  const compatibleDonors = donors.filter(donor => 
    donor.user && isBloodCompatible(donor.bloodGroup, bloodRequest.bloodGroup)
  );

  const notificationsToInsert = compatibleDonors.map(donor => ({
    recipient: donor.user._id,
    title: `🚨 Emergency Blood Request: ${bloodRequest.bloodGroup} Needed`,
    message: `Urgent request for ${bloodRequest.patientName} (${bloodRequest.unitsNeeded} units, ${bloodRequest.urgency.toUpperCase()} urgency) at ${bloodRequest.address}.`,
    type: 'request_match',
    link: `/requests/${bloodRequest._id}`,
  }));

  if (notificationsToInsert.length > 0) {
    await Notification.insertMany(notificationsToInsert);
    console.log(`[Notification Engine] Created ${notificationsToInsert.length} notifications for request ${bloodRequest._id}`);
  }

  return { count: notificationsToInsert.length };
};

const getUserNotifications = async (userId) => {
  return await Notification.find({ recipient: userId })
    .sort({ createdAt: -1 })
    .limit(20);
};

const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({ _id: notificationId, recipient: userId });
  if (!notification) throw new Error('Notification not found');

  notification.isRead = true;
  await notification.save();
  return notification;
};

module.exports = {
  notifyMatchedDonorsForRequest,
  getUserNotifications,
  markAsRead,
};

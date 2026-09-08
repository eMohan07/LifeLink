const Donation = require('../models/Donation');
const DonorProfile = require('../models/DonorProfile');
const BloodRequest = require('../models/BloodRequest');
const Hospital = require('../models/Hospital');
const Notification = require('../models/Notification');

const pledgeDonation = async (donorUserId, requestId, unitsDonated = 1) => {
  const request = await BloodRequest.findById(requestId);
  if (!request) throw new Error('Blood request not found');

  const donorProfile = await DonorProfile.findOne({ user: donorUserId });

  const existingPledge = await Donation.findOne({
    donor: donorUserId,
    request: requestId,
    status: { $in: ['pledged', 'completed'] },
  });

  if (existingPledge) {
    throw new Error('You have already pledged or completed a donation for this request');
  }

  const donation = await Donation.create({
    donor: donorUserId,
    donorProfile: donorProfile ? donorProfile._id : null,
    request: requestId,
    unitsDonated,
    status: 'pledged',
  });

  // Update request status to 'matching' if open
  if (request.status === 'open') {
    request.status = 'matching';
    await request.save();
  }

  // Notify requester
  await Notification.create({
    recipient: request.requester,
    title: '❤️ A Donor Has Pledged to Help!',
    message: `A donor has pledged to donate ${unitsDonated} unit(s) of ${request.bloodGroup} for ${request.patientName}.`,
    type: 'status_update',
    link: `/requests/${request._id}`,
  });

  return await donation.populate(['donor', 'request']);
};

const completeDonation = async (donationId) => {
  const donation = await Donation.findById(donationId);
  if (!donation) throw new Error('Donation record not found');

  donation.status = 'completed';
  donation.donationDate = new Date();
  await donation.save();

  // Update Donor Profile stats & last donation date
  if (donation.donorProfile) {
    await DonorProfile.findByIdAndUpdate(donation.donorProfile, {
      lastDonationDate: new Date(),
      $inc: { totalDonations: 1 },
    });
  } else {
    await DonorProfile.findOneAndUpdate(
      { user: donation.donor },
      { lastDonationDate: new Date(), $inc: { totalDonations: 1 } }
    );
  }

  // Update Request status to fulfilled
  const request = await BloodRequest.findById(donation.request);
  if (request) {
    request.status = 'fulfilled';
    await request.save();

    // If hospital linked, update inventory
    if (request.hospital) {
      await Hospital.findByIdAndUpdate(request.hospital, {
        $inc: { 'inventory.$[elem].units': donation.unitsDonated },
      }, {
        arrayFilters: [{ 'elem.bloodGroup': request.bloodGroup }],
      });
    }
  }

  return await donation.populate(['donor', 'request']);
};

const getUserDonationHistory = async (userId) => {
  return await Donation.find({ donor: userId })
    .populate({
      path: 'request',
      populate: { path: 'requester', select: 'name email phone' },
    })
    .sort({ createdAt: -1 });
};

const getAllDonations = async () => {
  return await Donation.find()
    .populate('donor', 'name email phone')
    .populate('request', 'patientName bloodGroup unitsNeeded urgency address status')
    .sort({ createdAt: -1 });
};

module.exports = {
  pledgeDonation,
  completeDonation,
  getUserDonationHistory,
  getAllDonations,
};

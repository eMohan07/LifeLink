const Hospital = require('../models/Hospital');
const User = require('../models/User');

const getHospitalByUserId = async (userId) => {
  let hospital = await Hospital.findOne({ user: userId }).populate('user', 'name email phone role');
  if (!hospital) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    hospital = await Hospital.create({
      user: userId,
      name: `${user.name} Center`,
      phone: user.phone || '',
      location: {
        type: 'Point',
        coordinates: [77.2090, 28.6139],
      },
    });
    hospital = await hospital.populate('user', 'name email phone role');
  }
  return hospital;
};

const updateInventoryByUserId = async (userId, inventoryData) => {
  let hospital = await Hospital.findOne({ user: userId });
  if (!hospital) {
    throw new Error('Hospital profile not found');
  }
  hospital.inventory = inventoryData;
  await hospital.save();
  return hospital;
};

const getAllHospitals = async () => {
  return await Hospital.find().populate('user', 'name email phone role');
};

module.exports = {
  getHospitalByUserId,
  updateInventoryByUserId,
  getAllHospitals,
};

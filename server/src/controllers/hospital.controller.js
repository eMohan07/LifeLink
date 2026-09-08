const hospitalService = require('../services/hospital.service');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getProfile = async (req, res) => {
  try {
    const hospital = await hospitalService.getHospitalByUserId(req.user._id);
    return sendSuccess(res, 'Hospital profile fetched', hospital);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const updateInventory = async (req, res) => {
  try {
    const hospital = await hospitalService.updateInventoryByUserId(req.user._id, req.body.inventory);
    return sendSuccess(res, 'Inventory updated successfully', hospital);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await hospitalService.getAllHospitals();
    return sendSuccess(res, 'All hospitals fetched', hospitals);
  } catch (error) {
    return sendError(res, error.message, 400);
  }
};

module.exports = {
  getProfile,
  updateInventory,
  getAllHospitals,
};

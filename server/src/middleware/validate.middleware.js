const { sendError } = require('../utils/responseHandler');

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      const formattedErrors = error.errors ? error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      })) : [{ message: error.message }];
      
      return sendError(res, 'Validation failed', 400, formattedErrors);
    }
  };
};

module.exports = { validate };

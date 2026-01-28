const validate = (schema) => {
  return (req, res, next) => {

    // checking if request body exists
    if (!req.body) {
      return next(new AppError('Request body is missing', 400));
    }

    const { error } = schema.validate(req.body);

    // sending error response if validation fails
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }

    // proceed to next middleware if validation is successful
    next();
  };
};

module.exports = {
  validate,
};

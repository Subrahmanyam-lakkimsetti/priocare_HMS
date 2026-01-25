const validate = (schema) => {
  return (req, res, next) => {

    // checking if request body exists
    if (!req.body) {
      return res.status(400).json({
        status: 'error',
        message: 'Request body is missing',
      });
    }

    const { error } = schema.validate(req.body);

    // sending error response if validation fails
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: error.details[0].message,
      });
    }

    // proceed to next middleware if validation is successful
    next();
  };
};

module.exports = {
  validate,
};

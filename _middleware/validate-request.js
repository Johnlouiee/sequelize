const validateRequest = (req, next, schema) => {
  const { error } = schema.validate(req.body);
  if (error) {
    next(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
  } else {
    next();
  }
};

module.exports = validateRequest;
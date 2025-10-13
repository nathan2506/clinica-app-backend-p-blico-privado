function validate(schema) {
  return (req, res, next) => {
    const data = req.body;
    const { error, value } = schema.validate(data, { abortEarly: false, stripUnknown: true });
    if (error) {
      return res.status(400).json({ error: 'Validation error', details: error.details.map(d => d.message) });
    }
    req.body = value;
    next();
  };
}

module.exports = validate;

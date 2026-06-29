const HttpError = require('../helpers/HttpError');

function validateBody(schema) {
  return (req, _res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(new HttpError(400, 'Request body is required'));
    }
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const message = error.details.map(d => d.message).join('; ');
      return next(new HttpError(400, message));
    }
    req.body = value;
    next();
  };
}

module.exports = validateBody;

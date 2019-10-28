const Joi = require("@hapi/joi");

const validateRegistration = data => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required(),
    secret: Joi.string()
      .min(4)
      .max(15)
      .required(),
    pid: Joi.number()
      .min(9)
      .required(),
  });

  return schema.validate(data);
};

module.exports = validateRegistration;

const Joi = require("@hapi/joi");

const validateAdmin = data => {
  const schema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string()
      .min(6)
      .required(),
  });

  return schema.validate(data);
};

module.exports = validateAdmin;

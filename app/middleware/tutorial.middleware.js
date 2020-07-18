const Joi = require("@hapi/joi");

const tutorialScheme = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().required(),
});

const validate = (req, res, next) => {
  const result = tutorialScheme.validate(req.body, { abortEarly: false });
  if (result.error) {
    const { details } = result.error;
    let pesan = [];
    details.map((i) => pesan.push({ [i.context.key]: i.message }));
    res.status(422).json({
      message: "Invalid request",
      data: pesan,
    });
  } else {
    next();
  }
};

module.exports = {
  validate,
};

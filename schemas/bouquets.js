const Joi = require('joi');

const bouquetCreateSchema = Joi.object({
  title: Joi.string().trim().min(1).max(120).required(),
  description: Joi.string().allow('', null),
  price: Joi.number().positive().precision(2).required(),
  favorite: Joi.boolean(),
  category: Joi.string().trim().max(60).allow('', null),
});

const bouquetUpdateSchema = Joi.object({
  title: Joi.string().trim().min(1).max(120),
  description: Joi.string().allow('', null),
  price: Joi.number().positive().precision(2),
  favorite: Joi.boolean(),
  category: Joi.string().trim().max(60).allow('', null),
}).min(1);

const bouquetFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = {
  bouquetCreateSchema,
  bouquetUpdateSchema,
  bouquetFavoriteSchema,
};

const { Bouquet } = require('../models');

async function listAll({ page, limit, category, favorite } = {}) {
  const where = {};
  if (category) where.category = category;
  if (favorite !== undefined) where.favorite = favorite === true || favorite === 'true';
  const options = {
    where,
    order: [['createdAt', 'DESC']],
  };
  if (limit) {
    options.limit = Number(limit);
    options.offset = (Math.max(1, Number(page) || 1) - 1) * Number(limit);
  }
  return Bouquet.findAndCountAll(options);
}

function findById(id) {
  return Bouquet.findByPk(id);
}

function create(data) {
  return Bouquet.create(data);
}

async function update(id, data) {
  const item = await Bouquet.findByPk(id);
  if (!item) return null;
  await item.update(data);
  return item;
}

async function destroy(id) {
  const item = await Bouquet.findByPk(id);
  if (!item) return null;
  await item.destroy();
  return item;
}

module.exports = {
  listAll,
  findById,
  create,
  update,
  destroy,
};

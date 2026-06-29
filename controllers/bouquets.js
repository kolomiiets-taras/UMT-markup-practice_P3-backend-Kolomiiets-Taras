const path = require('path');
const fs = require('fs').promises;
const gravatar = require('gravatar');
const service = require('../services/bouquets');
const HttpError = require('../helpers/HttpError');

const PUBLIC_DIR = path.resolve(__dirname, '..', 'public', 'photos');

function publicPhotoUrl(req, filename) {
  const base = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`;
  return `${base.replace(/\/$/, '')}/photos/${filename}`;
}

async function list(req, res, next) {
  try {
    const page = req.query.page || req.query._page;
    const limit = req.query.limit || req.query._limit;
    const { category, favorite } = req.query;
    const { rows, count } = await service.listAll({ page, limit, category, favorite });
    res.set('X-Total-Count', String(count));
    res.set('Access-Control-Expose-Headers', 'X-Total-Count');
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const item = await service.findById(req.params.id);
    if (!item) throw new HttpError(404, 'Not found');
    res.json(item);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const photoURL = gravatar.url(`${req.body.title}-${Date.now()}`, {
      s: '500',
      d: 'identicon',
    }, true);
    const created = await service.create({ ...req.body, photoURL });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const updated = await service.update(req.params.id, req.body);
    if (!updated) throw new HttpError(404, 'Not found');
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const removed = await service.destroy(req.params.id);
    if (!removed) throw new HttpError(404, 'Not found');
    res.json({ message: 'Bouquet deleted' });
  } catch (err) {
    next(err);
  }
}

async function setFavorite(req, res, next) {
  try {
    const updated = await service.update(req.params.id, { favorite: req.body.favorite });
    if (!updated) throw new HttpError(404, 'Not found');
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

async function updatePhoto(req, res, next) {
  try {
    if (!req.file) throw new HttpError(400, 'Photo file is required');
    const existing = await service.findById(req.params.id);
    if (!existing) throw new HttpError(404, 'Not found');

    const ext = path.extname(req.file.originalname);
    const safeBase = path.basename(req.file.originalname, ext).replace(/[^\w.-]+/g, '_');
    const finalName = `${req.params.id}_${Date.now()}_${safeBase}${ext}`;
    const destPath = path.join(PUBLIC_DIR, finalName);
    await fs.rename(req.file.path, destPath);

    const photoURL = publicPhotoUrl(req, finalName);
    const updated = await service.update(req.params.id, { photoURL });
    res.json(updated);
  } catch (err) {
    if (req.file && req.file.path) {
      fs.unlink(req.file.path).catch(() => {});
    }
    next(err);
  }
}

module.exports = {
  list,
  getOne,
  create,
  update,
  remove,
  setFavorite,
  updatePhoto,
};

const express = require('express');
const ctrl = require('../controllers/bouquets');
const validateBody = require('../middlewares/validateBody');
const upload = require('../middlewares/upload');
const {
  bouquetCreateSchema,
  bouquetUpdateSchema,
  bouquetFavoriteSchema,
} = require('../schemas/bouquets');

const router = express.Router();

router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/', validateBody(bouquetCreateSchema), ctrl.create);
router.put('/:id', validateBody(bouquetUpdateSchema), ctrl.update);
router.delete('/:id', ctrl.remove);
router.patch('/:id/favorite', validateBody(bouquetFavoriteSchema), ctrl.setFavorite);
router.patch('/:id/photo', upload.single('photo'), ctrl.updatePhoto);

module.exports = router;

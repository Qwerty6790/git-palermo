const express = require('express');
const router = express.Router();
const productController = require('./productControllers');
const { uploadProductsByEksMarket } = require('../../cron/exmarketCron')
const { uploadProductsByFavouriteLight } = require('../../cron/favouriteLightCron')
const { uploadProductsByLightStar } = require('../../cron/lightStarCron')
const { uploadProductsByKinkLight } = require('../../cron/kinklightCron')
const { uploadProductsByDenkirs } = require('../../cron/denkirsCron')
const { uploadProductsByWerkel } = require('../../cron/werkelCron')
const { uploadProductsByElektroStandard } = require('../../cron/electroStandart')

router.get('/products/:supplier', productController.getProducts);
router.get('/products/:supplier/:productId', productController.getProductById);

router.get('/upload/lightStar', uploadProductsByLightStar)
router.get('/upload/favouriteLight', uploadProductsByFavouriteLight)
router.get('/upload/eksMarket', uploadProductsByEksMarket)
router.get('/upload/kinkLight', uploadProductsByKinkLight)
router.get('/upload/denkirs', uploadProductsByDenkirs)
router.get('/upload/werkel', uploadProductsByWerkel)
router.get('/upload/electroStandart', uploadProductsByElektroStandard)

module.exports = router;

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    article: String,
    name: String,
    price: Number,
    stock: String,
    imageAddress: String,
    source: String  
});

const FavouriteLightProductModel = mongoose.model('FavouriteLightProduct', productSchema);
const LightStarProductModel = mongoose.model('LightStarProduct', productSchema);
const EksMarketProductModel = mongoose.model('EksMarketProduct', productSchema);
const KinkLightProductModel = mongoose.model('KinkLightProduct', productSchema);
const DenkirsProductModel = mongoose.model('DenkirsProductProduct', productSchema);
const WerkelProductModel = mongoose.model('WerkelProductProduct', productSchema);
const ElektroStandardProductModel = mongoose.model('ElektroStandardProduct', productSchema);

module.exports = { 
    FavouriteLightProductModel, 
    LightStarProductModel, 
    EksMarketProductModel, 
    KinkLightProductModel, 
    DenkirsProductModel, 
    WerkelProductModel,
    ElektroStandardProductModel
};

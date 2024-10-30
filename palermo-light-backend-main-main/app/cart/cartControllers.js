const { LightStarProductModel } = require('../products/productModel');
const { FavouriteLightProductModel } = require('../products/productModel');
const { EksMarketProductModel } = require('../products/productModel');
const { KinkLightProductModel } = require('../products/productModel');
const { DenkirsProductModel } = require('../products/productModel');
const { WerkelProductModel } = require('../products/productModel');
const { ElektroStandardProductModel } = require('../products/productModel');

const models = {
    LightStarProduct: LightStarProductModel,
    FavouriteLightProduct: FavouriteLightProductModel,
    EksMarketProduct: EksMarketProductModel,
    KinkLightProduct: KinkLightProductModel,
    DenkirsProduct: DenkirsProductModel,
    WerkelProduct: WerkelProductModel,
    ElektroStandardProduct: ElektroStandardProductModel,
};

exports.getCartProducts = async (req, res) => {
    const { products } = req.body; // Expecting products to be passed in the request body

    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: 'Invalid product list' });
    }

    try {
        const productDetails = await Promise.all(
            products.map(async (item) => {
                const ProductModel = models[item.supplier]; // Get the model based on supplier

                // Check if the model exists
                if (!ProductModel) {
                    return { productId: item.productId, supplier: item.supplier, quantity: item.quantity, error: 'Supplier model not found' };
                }

                const product = await ProductModel.findById(item.productId); // Fetch product by ID

                if (!product) {
                    return { productId: item.productId, supplier: item.supplier, quantity: item.quantity, error: 'Product not found' };
                }

                return {
                    ...product.toObject(),
                    quantity: item.quantity
                };
            })
        );

        res.json({ products: productDetails });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
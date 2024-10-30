const { LightStarProductModel } = require('./productModel');
const { FavouriteLightProductModel } = require('./productModel');
const { EksMarketProductModel } = require('./productModel');
const { KinkLightProductModel } = require('./productModel');
const { DenkirsProductModel } = require('./productModel');
const { WerkelProductModel } = require('./productModel');
const { ElektroStandardProductModel } = require('./productModel');

// Модели для разных поставщиков
const models = {
    FavouriteLight: FavouriteLightProductModel,
    LightStar: LightStarProductModel,
    EksMarket: EksMarketProductModel,
    KinkLight: KinkLightProductModel,
    Denkirs: DenkirsProductModel,
    Werkel: WerkelProductModel,
    ElectroStandart: ElektroStandardProductModel
};

// Модели для разных поставщиков для получение одного товара(костыль брат)
const modelsOfProduct = {
    FavouriteLightProduct: FavouriteLightProductModel,
    LightStarProduct: LightStarProductModel,
    EksMarketProduct: EksMarketProductModel,
    KinkLightProduct: KinkLightProductModel,
    DenkirsProduct: DenkirsProductModel,
    WerkelProduct: WerkelProductModel,
    ElektrostandardProduct: ElektroStandardProductModel
};

exports.getProducts = async (req, res) => {
    const { page = 1, limit = 10, name = '', minPrice = 0, maxPrice = Infinity } = req.query;
    const { supplier } = req.params;

    if (!models[supplier]) {
        return res.status(400).json({ message: 'Неверно указан поставщик' });
    }

    const ProductModel = models[supplier];

    try {
        // Извлечение короткого имени продукта с помощью регулярного выражения
        const nameRegex = new RegExp(/^(.*?)(, .*|$)/, 'i');
        const searchName = name.match(nameRegex)?.[1] || '';

        // Вычисление смещения для пагинации
        const skip = (page - 1) * limit;

        // Фильтрация по имени и цене
        const products = await ProductModel.find({
            name: { $regex: new RegExp(searchName, 'i') },
            price: { $gte: Number(minPrice), $lte: Number(maxPrice) }
        })
        .skip(skip)
        .limit(Number(limit));

        // Подсчет общего количества продуктов
        const totalProducts = await ProductModel.countDocuments({
            name: { $regex: new RegExp(searchName, 'i') },
            price: { $gte: Number(minPrice), $lte: Number(maxPrice) }
        });
        
        const totalPages = Math.ceil(totalProducts / limit);

        // Отправляем ответ с продуктами и дополнительной информацией о пагинации
        res.json({
            totalProducts,
            totalPages,
            currentPage: page,
            products
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Контроллер для получения одного товара по ID и поставщику
exports.getProductById = async (req, res) => {
    const { supplier, productId } = req.params;

    // Проверяем, существует ли модель для указанного поставщика
    if (!modelsOfProduct[supplier]) {
        return res.status(400).json({ message: 'Неверно указан поставщик' });
    }

    const ProductModel = modelsOfProduct[supplier];

    try {
        // Ищем товар по ID
        const product = await ProductModel.findById(productId);
        
        if (!product) {
            return res.status(404).json({ message: 'Товар не найден' });
        }

        // Отправляем найденный товар в ответе
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
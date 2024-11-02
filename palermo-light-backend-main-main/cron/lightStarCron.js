const axios = require('axios');
const xml2js = require('xml2js');
const { LightStarProductModel } = require('../app/products/productModel');

const uploadProductsByLightStar = async (req, res) => {
    const url = 'https://lightstar.ru/today/stock.xml'; 

    try {
        const response = await axios.get(url);
        const xmlData = response.data;

        xml2js.parseString(xmlData, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            const products = result.Таблица.element;

            const savePromises = products.map(lightData => {
                const retailPrice = lightData.Цены[0].$.Розничная ? parseFloat(lightData.Цены[0].$.Розничная) : 0;

                // Обновляем создание продукта согласно новой схеме
                const product = new LightStarProductModel({
                    article: lightData.Артикул[0],
                    name: lightData.Наименование[0],
                    price: retailPrice,
                    stock: lightData.Остаток[0] ? parseInt(lightData.Остаток[0]) : 0,
                    imageAddress: lightData.АдресКартинки[0],
                    source: 'LightStarProduct'  // Optional source field
                });

                return product.save();
            });

            Promise.all(savePromises)
                .then(() => res.status(200).send('Данные успешно занесены в БД!'))
                .catch(err => res.status(500).send('Ошибка сохранения в БД: ' + err.message));
        });
    } catch (error) {
        res.status(500).send('Ошибка при получении XML: ' + error.message);
    }
};

module.exports = { uploadProductsByLightStar };

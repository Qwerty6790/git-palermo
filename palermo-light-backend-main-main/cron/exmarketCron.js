const axios = require('axios');
const xml2js = require('xml2js');
const { EksMarketProductModel } = require('../app/products/productModel');

const uploadProductsByEksMarket = async (req, res) => {
    const url = 'https://eksmarket.ru/api/personal/feed/?type=xml';

    try {
        const response = await axios.get(url);
        const xmlData = response.data;

        xml2js.parseString(xmlData, { explicitArray: false, trim: true }, async (err, result) => {
            if (err) {
                return res.status(500).send('XML parsing error: ' + err.message);
            }

            const productionOrders = result.test.ProductionOrders.ProductionOrder;

            const savePromises = Array.isArray(productionOrders) ? productionOrders.map(order => {
                const retailPrice = parseFloat(order.Price_RRTS.replace(/\s/g, '').replace(',', '.')) || 0;

                // Skip products with a price of 0
                if (retailPrice === 0) {
                    return Promise.resolve();
                }

                const productName = order._ || order[''] || '';

                const product = new EksMarketProductModel({
                    article: order.Kod || '',
                    name: productName,
                    price: retailPrice,
                    stock: parseInt(order.Balance_MSK.replace(/\s/g, '')) || 0,
                    imageAddress: order.Image || '',
                    source: 'EksMarketProduct'  // Adding source
                });

                return product.save();
            }) : [];
            
            try {
                await Promise.all(savePromises);
                res.status(200).send('Данные успешно занесены в БД!');
            } catch (saveError) {
                res.status(500).send('Ошибка сохранения в БД: ' + saveError.message);
            }
        });
    } catch (error) {
        res.status(500).send('Error fetching XML: ' + error.message);
    }
};

module.exports = { uploadProductsByEksMarket };

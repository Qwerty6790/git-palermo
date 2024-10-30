const axios = require('axios');
const xml2js = require('xml2js');
const { DenkirsProductModel } = require('../app/products/productModel');

const uploadProductsByDenkirs = async (req, res) => {
    const url = 'https://dealer.denkirs.ru/catalog.xml';

    try {
        const response = await axios.get(url);
        const xmlData = response.data;

        xml2js.parseString(xmlData, { explicitArray: false, trim: true }, async (err, result) => {
            if (err) {
                return res.status(500).send('XML parsing error: ' + err.message);
            }

            const offers = result.yml_catalog.shop.offers.offer;

            const savePromises = Array.isArray(offers) ? offers.map(offer => {
                const price = parseFloat(offer.price) || 0;
                const stock = parseInt(offer.stock) || 0;

                if (price === 0) {
                    return Promise.resolve();
                }

                const product = new DenkirsProductModel({
                    article: offer.vendorCode || '',
                    name: offer.name || '',
                    price: price,
                    stock: stock,
                    imageAddress: offer.picture[0] || '',
                    source: 'DenkirsProduct'  // Adding source
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

module.exports = { uploadProductsByDenkirs };

const axios = require('axios');
const xml2js = require('xml2js');
const { WerkelProductModel } = require('../app/products/productModel');

const uploadProductsByWerkel = async (req, res) => {
    const url = 'https://werkel.ru/prices/prices-werkel-rur.yml';

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

                const product = new WerkelProductModel({
                    article: offer.vendorCode || '',
                    name: offer.name || '',
                    price: price,
                    stock: stock,
                    imageAddress: offer.picture[0] || '',
                    source: 'WerkelProduct'  // Adding source
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

module.exports = { uploadProductsByWerkel };

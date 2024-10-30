const axios = require('axios');
const xml2js = require('xml2js');
const iconv = require('iconv-lite');
const { KinkLightProductModel } = require('../app/products/productModel');

const uploadProductsByKinkLight = async (req, res) => {
    const url = 'https://kinklight.ru/obmen/yml/unir_full.xml';

    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const xmlData = iconv.decode(Buffer.from(response.data), 'windows-1251');

        xml2js.parseString(xmlData, { explicitArray: false, trim: true }, async (err, result) => {
            if (err) {
                return res.status(500).send('Ошибка парсинга XML: ' + err.message);
            }

            const offers = result.yml_catalog.shop.offers.offer;

            const savePromises = Array.isArray(offers) ? offers.map(offer => {
                const price = parseFloat(offer.price.replace(/\s/g, '').replace(',', '.')) || 0;
                const stock = offer.stock || '0';
                const productName = (offer.name || '').trim();

                if (price === 0) {
                    return Promise.resolve();
                }

                const imageUrl = Array.isArray(offer.picture) ? offer.picture[0] : offer.picture || '';

                const product = new KinkLightProductModel({
                    article: offer.vendorCode || '',
                    name: productName,
                    price: price,
                    stock: stock,
                    imageAddress: imageUrl,
                    source: 'KinkLightProduct'  // Optional source field
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
        res.status(500).send('Ошибка при получении XML: ' + error.message);
    }
};

module.exports = { uploadProductsByKinkLight };

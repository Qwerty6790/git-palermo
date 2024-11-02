const axios = require('axios'); 
const xml2js = require('xml2js');
const { FavouriteLightProductModel } = require('../app/products/productModel');

const uploadProductsByFavouriteLight = async (req, res) => {
    const productUrl = "https://ftp.favourite-light.com/ForClients/export/import.xml";
    const offerUrl = "https://ftp.favourite-light.com/ForClients/export/offers.xml";

    try {
        // Load product data
        const productResponse = await axios.get(productUrl);
        const productXmlData = productResponse.data;

        xml2js.parseString(productXmlData, async (err, productResult) => {
            if (err) {
                return res.status(500).send('XML parsing error: ' + err.message);
            }

            const products = productResult.Данные.Номенклатура;

            // Load offer data (prices, stock)
            const offerResponse = await axios.get(offerUrl);
            const offerXmlData = offerResponse.data;

            xml2js.parseString(offerXmlData, (err, offerResult) => {
                if (err) {
                    return res.status(500).send('XML parsing error: ' + err.message);
                }

                const offerElements = offerResult.Данные.Номенклатура;

                const savePromises = products.map(lightData => {
                    const offer = offerElements.find(o => o.$.Имя === lightData.$.Имя);

                    // Set stock as a string
                    const stockQuantity = offer && offer.Остаток[0] ? offer.Остаток[0] : '0'; // Default to '0' if not available

                    const product = new FavouriteLightProductModel({
                        article: lightData.$.Имя,
                        name: lightData.ПолноеНаименование[0],
                        price: offer ? parseInt(offer.ЦенаРРЦ[0]) : 0,
                        stock: stockQuantity, // Stock as a string
                        imageAddress: lightData.СсылкиНаФото[0].split(', ')[0] || '', // Get the first image
                        source: 'FavouriteLightProduct' // Adding source
                    });

                    return product.save();
                });

                Promise.all(savePromises)
                    .then(() => res.status(200).send('Данные успешно занесены в БД!'))
                    .catch(err => res.status(500).send('Ошибка сохранения в БД: ' + err.message));
            });
        });
    } catch (error) {
        res.status(500).send('Error fetching XML: ' + error.message);
    }
};

module.exports = { uploadProductsByFavouriteLight };

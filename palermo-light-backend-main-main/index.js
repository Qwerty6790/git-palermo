const express = require('express');
const cors = require('cors'); 
const cron = require('node-cron');
const connectDB = require('./config/db');

const authRouter = require('./app/auth/authRoutes');
const productRouter = require('./app/products/productRoutes');
const cartRouter = require('./app/cart/cartRoutes');
const ordersRoutes = require('./app/orders/ordersRoutes');

const { uploadProductsByDenkirs } = require('./cron/denkirsCron');
const { uploadProductsByElektroStandard } = require('./cron/electroStandart');
const { uploadProductsByEksMarket } = require('./cron/exmarketCron');
const { uploadProductsByFavouriteLight } = require('./cron/favouriteLightCron');
const { uploadProductsByKinkLight } = require('./cron/kinklightCron');
const { uploadProductsByLightStar } = require('./cron/lightStarCron');
const { uploadProductsByWerkel } = require('./cron/werkelCron');

const app = express();
const PORT = process.env.PORT || 3005;

// Подключение к базе данных
connectDB();

app.use(express.json());
app.use(cors()); 

// Определение маршрутов
app.use('/api', authRouter);
app.use('/api', productRouter);
app.use('/api', cartRouter);

app.get('/', (req, res) => {
    res.send("Основной сервер приложения запущен.");
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`http://localhost:${PORT}`);
    console.log(`               |`);
    console.log(`обновить базу  |`);
    console.log(`               |`);
    console.log(`http://localhost:${PORT}/api/upload/favouriteLight`);
    console.log(`http://localhost:${PORT}/api/upload/lightStar`);
    console.log(`http://localhost:${PORT}/api/upload/eksMarket`);
    console.log(`http://localhost:${PORT}/api/upload/kinkLight`);
    console.log(`http://localhost:${PORT}/api/upload/denkirs`);
    console.log(`http://localhost:${PORT}/api/upload/werkel`);
    console.log(`http://localhost:${PORT}/api/upload/electroStandart`);
});

module.exports = app;

cron.schedule('0 */3 * * *', () => {
    uploadProductsByDenkirs();
    uploadProductsByElektroStandard();
    uploadProductsByEksMarket();
    uploadProductsByFavouriteLight();
    uploadProductsByKinkLight();
    uploadProductsByLightStar();
    uploadProductsByWerkel();
});


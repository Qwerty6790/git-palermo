const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://root:8fOYnDvsQOOCqB6r@cluster0.sgflo.mongodb.net/PalermoLight?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB подключен');
    } catch (error) {
        console.error('Ошибка подключения к MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;

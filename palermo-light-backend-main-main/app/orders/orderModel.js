const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, required: true },
            supplier: { type: String, required: true },
            quantity: { type: Number, default: 1 },
            status: { type: String, default: 'Ожидает подтверждения' }, 
        }
    ],
    status: { type: Array, default: ['Ожидает обработки'] }, 
    userId: { type: mongoose.Schema.Types.ObjectId, required: true }, 
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true }); 

const OrderModel = mongoose.model('Order', orderSchema);
module.exports = { OrderModel };

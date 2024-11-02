const express = require('express');
const { addOrder, getUserOrders, deleteOrder, updateProductInOrderStatus, updateOrderStatus } = require('./ordersControllers'); // Подкорректируйте путь
const authenticate = require('../auth/authMiddleware');
const router = express.Router();

// Добавление заказа
router.post('/add-order', authenticate, addOrder);

// Получение заказов пользователя
router.get('/orders', authenticate, getUserOrders);

// Удаление заказа
router.delete('/orders/:orderId', authenticate, deleteOrder); // Используем DELETE метод и передаем orderId в параметрах

// Обновление статуса товара в заказе
router.patch('/orders/:orderId/products/:productId/status', updateProductInOrderStatus); // Используем PATCH метод и передаем orderId и productId в параметрах

// Обновление статуса заказа
router.patch('/orders/:orderId/status', updateOrderStatus); // Используем PATCH метод и передаем orderId в параметрах

module.exports = router;

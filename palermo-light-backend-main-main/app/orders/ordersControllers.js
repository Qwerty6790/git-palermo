const { OrderModel } = require('./orderModel'); // Импорт модели заказа

// Функция для добавления заказа
exports.addOrder = async (req, res) => {
    const { products } = req.body; // Ожидаем, что товары будут переданы в теле запроса
    const userId = req.user.userId; // Получаем userId из req.user

    if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ message: 'Недействительный список товаров' });
    }

    try {
        const order = new OrderModel({ userId, products });
        await order.save();
        res.status(201).json({ message: 'Заказ создан', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Функция для получения заказов пользователя
exports.getUserOrders = async (req, res) => {
    const userId = req.user.userId; // Получаем userId из req.user

    try {
        const orders = await OrderModel.find({ userId }).sort({ createdAt: -1 }); // Сортировка по дате
        res.json({ orders });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Функция для удаления заказа
exports.deleteOrder = async (req, res) => {
    const userId = req.user.userId; 
    const { orderId } = req.params; // Ожидаем, что orderId будет передан в параметрах запроса

    try {
        const order = await OrderModel.findOneAndDelete({ _id: orderId, userId });

        if (!order) {
            return res.status(404).json({ message: 'Заказ не найден или не принадлежит пользователю' });
        }

        res.status(200).json({ message: 'Заказ успешно удалён' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Функция для обновления статуса товара в заказе
exports.updateProductInOrderStatus = async (req, res) => {
    const { orderId, productId } = req.params; // productId также в параметрах
    const { status } = req.body;

    try {
        const order = await OrderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Заказ не найден' });
        }

        const product = order.products.find(p => p.productId.toString() === productId);

        if (!product) {
            return res.status(404).json({ message: 'Товар не найден в заказе' });
        }

        product.status = status; 
        await order.save(); 

        res.status(200).json({ message: 'Состояние товара успешно изменено', product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Функция для обновления статуса заказа
exports.updateOrderStatus = async (req, res) => {
    const { orderId } = req.params; 
    const { status } = req.body;

    try {
        const order = await OrderModel.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Заказ не найден' });
        }

        order.status = status; 
        await order.save(); 

        res.status(200).json({ message: 'Состояние заказа успешно изменено' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

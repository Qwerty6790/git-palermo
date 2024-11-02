'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';

interface Product {
  _id: string;
  name: string;
  price: number;
  imageAddress: string;
  quantity: number;
}

interface Order {
  orderId: string;
  items: Product[];
  totalAmount: number;
  status: string;
}

const Cart: React.FC = () => {
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'cart' | 'orders'>('cart');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  const isAuthenticated = false; // Замените на проверку аутентификации

  useEffect(() => {
    const fetchCartProducts = async () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '{"products": []}');
      const storedCartCount = localStorage.getItem('cartCount');

      if (storedCartCount) {
        setCartCount(Number(storedCartCount));
      }

      if (cart.products.length > 0) {
        try {
          const response = await fetch('https://palermo-light-backend-main.vercel.app/api/cart/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ products: cart.products }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch cart products');
          }

          const data = await response.json();
          setCartProducts(data.products);
        } catch (error) {
          setError('Произошла ошибка при загрузке продуктов из корзины.');
          console.error(error);
        }
      } else {
        setError('Корзина пуста.');
      }
    };

    fetchCartProducts();

    // Получение заказов из localStorage
    const fetchedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(fetchedOrders);
  }, []);

  const handleRemoveProduct = (id: string) => {
    setCartProducts((prevProducts) => {
      const updatedProducts = prevProducts
        .map((product) => {
          if (product._id === id) {
            const updatedQuantity = product.quantity - 1;
            return updatedQuantity <= 0 ? null : { ...product, quantity: updatedQuantity };
          }
          return product;
        })
        .filter((product) => product !== null) as Product[];

      localStorage.setItem('cart', JSON.stringify({ products: updatedProducts }));
      setCartCount(updatedProducts.length); // Обновляем количество в корзине
      localStorage.setItem('cartCount', updatedProducts.length.toString());

      toast.success('Товар удален из корзины');
      return updatedProducts;
    });
  };

  const handleClearCart = () => {
    setCartProducts([]);
    localStorage.setItem('cart', JSON.stringify({ products: [] }));
    setCartCount(0);
    localStorage.setItem('cartCount', '0');
    setError('Корзина пуста.');
    toast.success('Корзина очищена');
  };

  const handleOrder = () => {
    if (!isAuthenticated) {
      toast.error('Пожалуйста, войдите в аккаунт перед оформлением заказа.');
      return;
    }
    setSelectedProducts(cartProducts);
    setIsModalOpen(true);
  };

  const confirmOrder = () => {
    const totalAmount = cartProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);
    const newOrder: Order = {
      orderId: `${Date.now()}`,
      items: selectedProducts,
      totalAmount,
      status: 'Processing',
    };

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    handleClearCart();
    setIsModalOpen(false);
    toast.success('Заказ успешно оформлен!');
  };

  const handleCancelOrder = (orderId: string) => {
    setOrders((prevOrders) => {
      const updatedOrders = prevOrders.map((order) =>
        order.orderId === orderId ? { ...order, status: 'Cancelled' } : order
      );

      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      toast.success('Заказ успешно отменен');
      return updatedOrders;
    });
  };

  const totalAmount = cartProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);

  const toggleTab = (tab: 'cart' | 'orders') => {
    setActiveTab(tab);
  };

  return (
    <motion.section
      className="py-20 dark:bg-black dark:text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto mt-20">
        <div className="p-4 mx-auto md:px-10 lg:px-32 xl:max-w-3xl">
          <h1 className="text-2xl font-bold text-center mb-6">Корзина</h1>
          <div className="flex flex-col items-center mb-4">
            <div className="flex justify-center space-x-4">
              <button
                className={`px-4 py-2 rounded-md ${activeTab === 'cart' ? 'bg-neutral-700 text-white' : 'text-white '}`}
                onClick={() => toggleTab('cart')}
              >
                Корзина
              </button>
              <button
                className={`px-4 py-2 rounded-md ${activeTab === 'orders' ? 'bg-neutral-700 text-white' : 'text-white '}`}
                onClick={() => toggleTab('orders')}
              >
                Мои Заказы
              </button>
            </div>
            <div
              className={`mt-2 h-1 bg-yellow-500 transition-all duration-300 ${activeTab === 'cart' ? 'w-20' : 'w-32'}`}
              style={{ width: activeTab === 'cart' ? '5ch' : '8ch' }}
            />
          </div>

          {activeTab === 'cart' ? (
            <div className="flex flex-col mt-4">
              {error ? (
                <div className="text-center p-4">{error}</div>
              ) : (
                cartProducts.length > 0 ? (
                  cartProducts.map((product) => (
                    <div key={product._id} className="flex justify-between items-center border-b p-4 transition-all duration-300">
                      <img src={product.imageAddress} alt={product.name} className="w-24 h-24 object-cover rounded-md" />
                      <div className="flex-grow mx-4">
                        <h2 className="text-lg font-semibold">{product.name}</h2>
                        <p className="text-white">Цена: {product.price} ₽</p>
                        <p className="text-white">Количество: {product.quantity}</p>
                      </div>
                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                        onClick={() => handleRemoveProduct(product._id)}
                      >
                        Удалить
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4">Корзина пуста.</div>
                )
              )}
              {cartProducts.length > 0 && (
                <>
                  <div className="flex justify-between font-bold border-t-2 mt-4 p-4">
                    <span>Итого:</span>
                    <span>{totalAmount} ₽</span>
                  </div>
                  <div className="flex justify-end p-4">
                    <div className="space-x-4">
                      <button
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                        onClick={handleClearCart}
                      >
                        Очистить Корзину
                      </button>
                      <button
                        onClick={handleOrder}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
                      >
                        Заказать
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col mt-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.orderId} className="flex justify-between items-center border-b p-4 transition-all duration-300">
                    <div className="flex-grow">
                      <h2 className="text-lg font-semibold">Заказ ID: {order.orderId}</h2>
                      <p className="text-white">Общая сумма: {order.totalAmount} ₽</p>
                      <p className="text-white">Статус: {order.status}</p>
                    </div>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      onClick={() => handleCancelOrder(order.orderId)}
                    >
                      Отменить
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center p-4">Нет заказов.</div>
              )}
            </div>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-md shadow-md">
                <h2 className="text-lg font-bold">Подтверждение Заказа</h2>
                <p className="mt-2">Вы уверены, что хотите оформить заказ?</p>
                <div className="flex justify-end space-x-4 mt-4">
                  <button
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Отмена
                  </button>
                  <button
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
                    onClick={confirmOrder}
                  >
                    Подтвердить
                  </button>
                </div>
              </div>
            </div>
          )}
          <Toaster />
        </div>
      </div>
    </motion.section>
  );
};

export default Cart;

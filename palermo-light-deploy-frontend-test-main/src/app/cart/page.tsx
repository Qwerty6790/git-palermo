'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'sonner';

interface Product {
  _id: string;
  name: string;
  price: number;
  imageAddress: string; // Image address for the product
  quantity: number;
}

interface Order {
  orderId: string;
  items: Product[];
  totalAmount: number;
}

const Cart: React.FC = () => {
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'cart' | 'orders'>('cart');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  
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
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ products: cart.products }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch cart products');
          }

          const data = await response.json();
          setCartProducts(data.products);
        } catch (error: unknown) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError('Произошла ошибка'); // Fallback error message
          }
          console.error(error);
        }
      } else {
        setError('Корзина пуста.');
      }
    };

    fetchCartProducts();

    // Fetch orders from local storage (or an API)
    const fetchedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(fetchedOrders);
  }, []);

  const handleRemoveProduct = (id: string) => {
    setCartProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) => {
        if (product._id === id) {
          const updatedQuantity = product.quantity - 1;

          if (updatedQuantity <= 0) {
            return null;
          }
          return { ...product, quantity: updatedQuantity }; // Уменьшаем количество на 1
        }
        return product; // Возвращаем остальные товары без изменений
      }).filter((product) => product !== null); // Удаляем товары с количеством 0

      localStorage.setItem('cart', JSON.stringify({ products: updatedProducts }));

      // Обновление cartCount
      const newCartCount = cartCount - 1;
      setCartCount(newCartCount);
      localStorage.setItem('cartCount', newCartCount.toString());

      toast.success('Товар удален из корзины');
      return updatedProducts as Product[]; // Приводим к типу Product[]
    });
  };

  const handleClearCart = () => {
    setCartProducts([]);
    localStorage.setItem('cart', JSON.stringify({ products: [] }));

    // Обнуление cartCount
    setCartCount(0);
    localStorage.setItem('cartCount', '0');

    setError('Корзина пуста.');
    toast.success('Корзина очищена');
  };

  const handleOrder = () => {
    // Save selected products for confirmation in the modal
    setSelectedProducts(cartProducts);
    setIsModalOpen(true);
  };

  const totalAmount = cartProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);

  const toggleTab = (tab: 'cart' | 'orders') => {
    setActiveTab(tab);
  };

  const confirmOrder = () => {
    // Logic to save the order can be implemented here

    // Clear the cart
    handleClearCart();
    setIsModalOpen(false);
    toast.success('Заказ успешно оформлен!');
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
          <div className="flex justify-center space-x-4 mb-4">
            <button
              className={`px-4 py-2 rounded-md ${activeTab === 'cart' ? 'bg-black text-white' : 'bg-black'}`}
              onClick={() => toggleTab('cart')}
            >
              Корзина
            </button>
            <button
              className={`px-4 py-2 rounded-md ${activeTab === 'orders' ? 'bg-black text-white' : 'bg-black'}`}
              onClick={() => toggleTab('orders')}
            >
              Мои Заказы
            </button>
          </div>

          {activeTab === 'cart' ? (
            <div className="flex flex-col mt-4">
              {error ? (
                <div className="text-center p-4">{error}</div>
              ) : (
                cartProducts.length > 0 ? (
                  <>
                    {cartProducts.map((product) => (
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
                    ))}

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
                ) : (
                  <div className="text-center p-4">Корзина пуста</div>
                )
              )}
            </div>
          ) : (
            <div className="mt-4">
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order, index) => (
                    <div key={index} className="border rounded-md p-4 bg-gray-50 dark:bg-gray-800">
                      <h3 className="font-semibold">Заказ ID: {order.orderId}</h3>
                      <ul className="list-disc pl-5">
                        {order.items.map(item => (
                          <li key={item._id} className="text-gray-700 dark:text-gray-300">
                            {item.name} - {item.quantity} шт. ({item.price} ₽)
                          </li>
                        ))}
                      </ul>
                      <p className="font-bold">Итого: {order.totalAmount} ₽</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4">У вас нет заказов.</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal for Order Confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            className="bg-white dark:bg-black border p-6 rounded-lg shadow-lg w-96"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-4">Подтверждение заказа</h2>
            <div>
              <h3 className="text-lg font-semibold">Ваш заказ:</h3>
              {selectedProducts.map((product) => (
                <div key={product._id} className="flex justify-between mt-2">
                  <img src={product.imageAddress} alt={product.name} className="w-16 h-16 object-cover rounded-md mr-2" />
                  <span className="flex-grow">{product.name} (x{product.quantity})</span>
                  <span>{product.price} ₽</span>
                </div>
              ))}
              <div className="font-bold mt-4">
                <span>Итого: {totalAmount} ₽</span>
              </div>
            </div>
            <p className="mt-4">Вы уверены, что хотите оформить заказ?</p>
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                Отмена
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                onClick={confirmOrder}
              >
                Подтвердить заказ
              </button>
            </div>
          </motion.div>
        </div>
      )}
      <Toaster position="top-center" />
    </motion.section>
  );
};

export default Cart;

'use client';
import React, { useState } from 'react';
import { Toaster } from 'sonner';
import { ClipLoader } from 'react-spinners';

const AdminPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [orders, setOrders] = useState<any[]>([]); // Замените any на интерфейс заказов

  // Функция для получения заказов
  const fetchOrders = async () => {
    setLoading(true);
    // Здесь добавьте логику получения заказов из API
    const res = await fetch('/'); // Укажите ваш API
    const data = await res.json();
    setOrders(data.orders);
    setLoading(false);
  };

  // Вызов функции для получения заказов при загрузке страницы
  React.useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen  bg-black text-white flex flex-col">
      <Toaster position="top-center" richColors />
      <header className="bg-black text-white p-4">
        <h1 className="text-xl font-bold">Админка</h1>
      </header>
      
      <main className="flex-grow p-6 mt-56">
        <h2 className="text-2xl font-semibold mb-4">Заказы</h2>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <ClipLoader color="#000" loading={loading} size={50} />
          </div>
        ) : (
          <table className="min-w-full bg-black border border-gray-300">
            <thead>
              <tr className="bg-black">
                <th className="py-2 px-4 border">ID Заказа</th>
                <th className="py-2 px-4 border">Имя</th>
                <th className="py-2 px-4 border">Электронная почта</th>
                <th className="py-2 px-4 border">Статус</th>
                <th className="py-2 px-4 border">Дата</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border">{order.id}</td>
                    <td className="py-2 px-4 border">{order.name}</td>
                    <td className="py-2 px-4 border">{order.email}</td>
                    <td className="py-2 px-4 border">{order.status}</td>
                    <td className="py-2 px-4 border">{new Date(order.date).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-2 px-4 border text-center">Нет доступных заказов</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </main>

      <footer className="bg-black text-white p-4 text-center">
        <p>&copy; 2024 Ваша Компания</p>
      </footer>
    </div>
  );
};

export default AdminPage;

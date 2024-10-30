'use client';
import React, { useEffect, useState } from 'react';
import { CircleUser } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    checkUserLogged();
  };

  const checkUserLogged = () => {
    setIsLoggedIn(!!localStorage.getItem('token'));
    setUsername(localStorage.getItem('username'));
  };

  useEffect(() => {
    checkUserLogged();
  }, []);

  return (
    <motion.section
      className="py-20 dark:bg-black dark:text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mt-36 mx-auto">
        <div className="p-4 mx-auto text-center md:px-10 lg:px-32 xl:max-w-3xl">
          <h1 className="text-3xl font-bold mb-6">Ваш Профиль</h1>
          {isLoggedIn && (
            <p className="text-lg text-gray-500 mb-4">Приятных вам покупок!</p>
          )}
          <div className="text-center p-6 rounded-xl shadow-lg border border-gray-300 mt-6 max-w-lg mx-auto">
            {isLoggedIn ? (
              <>
                <p className="text-lg font-semibold mb-4">Вы вошли в аккаунт</p>
                <div className="flex flex-col items-center space-y-4">
                  <a href="/profile" className="flex items-center text-white">
                    <CircleUser className="mr-2" color="white" size={50} />
                    <span className="text-xl font-medium">{username}</span>
                  </a>
                  <a
                    href="/orders"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-600 transition duration-300"
                  >
                    Заказы
                  </a>
                  <a
                    href="/cart"
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-600 transition duration-300"
                  >
                    Корзина
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-600 transition duration-300"
                  >
                    Выйти
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold text-red-500 mb-4">Войдите в аккаунт</p>
                <div className="flex flex-col items-center">
                  <a href="/auth/register" className="flex items-center text-gray-400 underline">
                    <CircleUser className="mr-2" color="white" size={50} />
                    <span className="text-lg">Войти</span>
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Profile;

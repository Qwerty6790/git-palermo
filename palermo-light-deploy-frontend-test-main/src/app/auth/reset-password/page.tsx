'use client'
import React, { useState } from 'react';

const Recover: React.FC = () => {
  const [email, setEmail] = useState<string>(''); // Тип для email
  const [errorMessage, setErrorMessage] = useState<string>(''); // Тип для сообщения об ошибке
  const [successMessage, setSuccessMessage] = useState<string>(''); // Тип для сообщения об успехе

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('https://palermo-light-backend-main.vercel.app/api/reset-password', { // Исправленный URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Инструкции по сбросу пароля отправлены на почту');
        setErrorMessage('');
      } else {
        setErrorMessage(data.message || 'Ошибка при отправке почты');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Произошла ошибка, попробуйте позже');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center">
      <div className="bg-black bg-opacity-80 p-8 lg:mt-20 rounded shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-white text-center mb-6">PalermoLight</h1>
        <p className="text-3xl font-bold text-white text-center mb-6">Восстановить пароль по почте</p>
        
        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 text-center">{successMessage}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="example@mail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Обновление состояния
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-black text-white border rounded-md transition duration-300 hover:border-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-neutral-950 focus:ring-offset-2"
          >
            Продолжить
          </button>
        </form>
      </div>
    </div>
  );
};

export default Recover;

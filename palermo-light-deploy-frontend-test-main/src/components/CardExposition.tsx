'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface CardProps {
  images: string[];
}

const StackedCards: React.FC<CardProps> = ({ images }) => {
  return (
    <div className="relative -z-20 group max-lg:hidden max-md:hidden max-xl:hidden overflow-hidden lg:ml-[245px] lg:-mt-[500px] w-40 h-96">
      {images.map((image, index) => (
        <motion.div
          key={index}
          className={`absolute inset-0 bg-cover bg-center rounded-lg transition-transform duration-300 ${index === 0 ? 'z-10' : 'z-0'}`}
          style={{
            backgroundImage: `url(${image})`,
            width: '100%',
            height: '100%',
            transform: `translateX(${index * 15}px)`, // Изменил значение для сдвига
          }}
          whileHover={{ translateX: 20 }} // Двигается вправо при наведении
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black bg-opacity-50 text-white">
        {/* Можно добавить текст, если необходимо */}
      </div>

      {/* Кнопка "Подробнее" */}
      <Link href="/about" className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white text-black py-1 px-3 rounded-lg transition-colors duration-300 hover:bg-gray-200 z-20">
        Подробнее
      </Link>
    </div>
  );
};

const CardContainer: React.FC = () => {
  const collections = [
    {
      images: ["/images/Side.png"],
    },
    {
      images: ["/images/Side2.png"],
    },
    {
      images: ["/images/Side7.png"],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {collections.map((collection, index) => (
        <StackedCards
          key={index}
          images={collection.images}
        />
      ))}
    </div>
  );
};

export default CardContainer;

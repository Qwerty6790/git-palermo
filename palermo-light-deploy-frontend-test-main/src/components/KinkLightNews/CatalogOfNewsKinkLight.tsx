import Link from 'next/link';
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export interface ProductI {
  _id: string; 
  article: string;
  name: string;
  price: number;
  stock: string;
  imageAddress: string;
  source: string;
}

export const CatalogOfProductsNewsKinklight: React.FC<{ products: ProductI[] }> = ({ products }) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 3;
  const totalProducts = products.length;
  const [showDetails, setShowDetails] = useState(false);
  const [showTitles, setShowTitles] = useState(false);

  const scrollLeft = () => {
    setCurrentIndex((prev) => (prev - itemsToShow + totalProducts) % totalProducts);
  };

  const scrollRight = () => {
    setCurrentIndex((prev) => (prev + itemsToShow) % totalProducts);
  };

  useEffect(() => {
    const interval = setInterval(scrollRight, 3000); // Auto-scroll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  // Trigger the animation for "KinkLight" and "Подробнее"
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowDetails(true);
      setShowTitles(true);
    }, 1500); // Show titles after 1.5 seconds
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative scale-90 flex items-center">
      <div className="absolute right-0 space-y-2">
      </div>
      <div
        className=" cursor-default select-none"
        ref={scrollRef}
        style={{ userSelect: 'none', width: '100%' }}
      >
        <motion.div
          className="flex space-x-6 md:space-x-8 lg:space-x-10 p-4"
          key={currentIndex} // Trigger animation on index change
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {products.slice(currentIndex, currentIndex + itemsToShow).map((product) => {
            const stockCount = parseInt(product.stock);
            const stockClass = stockCount > 0 ? 'text-green-500' : 'text-red-500';

            return (
              <Link key={product._id} href={`/products/${product.source}/${product._id}`} passHref>
                <motion.div
                  className="relative shadow-lg shadow-zinc-900 transition duration-300 cursor-pointer hover:shadow-zinc-600 bg-white border border-zinc-700 rounded-lg overflow-hidden w-60 sm:w-72 md:w-80"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    className="w-full h-48 sm:h-56 md:h-64 object-cover transition-transform duration-200"
                    src={product.imageAddress}
                    alt={product.name}
                    style={{ pointerEvents: 'none' }}
                  />
                  <div className="p-4 bg-black">
                    <h2 className="text-white text-lg font-semibold truncate">{product.name}</h2>
                    <p className="font-bold text-white text-xl text-gradient-to-b from-zinc-300 to-white mt-1">
                      {product.price} ₽
                    </p>
                    <div className={`text-sm mt-2 ${stockClass}`}>
                      <p>Остаток: {product.stock} шт.</p>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <button className="border max-md:ml-[120px] border-white transition duration-500 hover:bg-zinc-700 text-white py-1 rounded-md w-24 lg:ml-28 lg:mb-5">
                      В Корзину
                    </button>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

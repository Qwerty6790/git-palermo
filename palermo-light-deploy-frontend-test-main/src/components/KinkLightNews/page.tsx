'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CatalogOfProductsNewsKinklight, ProductI } from './CatalogOfNewsKinkLight';

const minPrice = 0;
const maxPrice = 1000000;
const page = 1;

const KinkLight: React.FC = () => {
  const [products, setProducts] = useState<ProductI[]>([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(
        `https://palermo-light-backend-main.vercel.app/api/products/KinkLight?page=${page}&limit=9&name=Подвес&minPrice=${minPrice}&maxPrice=${maxPrice}`
      );
      if (!res.ok) {
        throw new Error('Сетевая ошибка при загрузке товаров');
      }
      const data = await res.json();
      console.log(data.products); // Логируем полученные товары
      setProducts(data.products);
    } catch (error) {
      console.error('Ошибка при загрузке товаров:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <><motion.div
      className='lg:-ml-64    max-xl:hidden max-lg:hidden max-md:hidden '
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {products.length > 0 ? (
        <CatalogOfProductsNewsKinklight products={products} />
      ) : (
        <p>Товары не найдены.</p>
      )}
    </motion.div></>
  );
};

export default KinkLight;
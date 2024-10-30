'use client'
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CatalogOfProductsNewsDenkirs, ProductI } from './CatalogOfNewsDenkirs';


interface Category {
  label: string;
  searchName: string;
}

interface Brand {
  name: string;
  categories: Category[];
  collection: string;
}

const selectedBrand: Brand = {
  name: 'Denkirs',
  categories: [
    { label: 'Люстра Потолочная', searchName: 'Люстра Потолочная' },
    { label: 'Люстра подвесная', searchName: 'Люстра подвесная' },
    { label: 'Подвес', searchName: 'Подвес' },
    { label: 'Бра', searchName: 'Бра' },
  ],
  collection: '',
};

const minPrice = 0;
const maxPrice = 1000000;
const page = 1;

const Denkirs: React.FC = () => {
    const [products, setProducts] = useState<ProductI[]>([]);
const fetchProducts = async () => {
    try {
      const res = await fetch(
        `https://palermo-light-backend-main.vercel.app/api/products/${selectedBrand.name}?page=${page}&limit=6&name=Трековый светильник&minPrice=${minPrice}&maxPrice=${maxPrice}`
      );
      if (!res.ok) {
        throw new Error('Сетевая ошибка при загрузке товаров');
      }
      const data = await res.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Ошибка при загрузке товаров:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  return (
    <motion.div
    className=' '
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
   
  <CatalogOfProductsNewsDenkirs products={products} />
  </motion.div>
);
};

  export default Denkirs;
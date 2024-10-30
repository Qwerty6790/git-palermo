'use client';
import React, { useEffect, useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Pagination from '../../components/PaginationComponents';
import { CatalogOfProducts } from '../../components/CatalogOfProducts';
import { ProductI } from '../../components/CatalogOfProducts';
import FilterSed from '../../components/FutureFilterComponents';
import { Toaster } from 'sonner'
import Favorite from '@/components/KinkLightNews/page';
import { ClipLoader } from 'react-spinners';
import FilterOptions from '@/components/FutureFilterOptionsComponents';
import ZigzagProgressBar from '@/components/ZigZagProgress';

type Category = {
  label: string;
  href?: string; // href может быть необязательным
  searchName: string;
};

type Brand = {
  name: string;
  categories: Category[];
  collection?: string; // collection также может быть необязательным
};

// Массив брендов
const brands: Brand[] = [
  {
    name: 'FavouriteLight',
    categories: [
      { label: 'Потолочная Люстра', searchName: 'Потолочная Люстра' },
      { label: 'Люстра подвесная', searchName: 'Люстра подвесная' },
      { label: 'Подвес', searchName: 'Подвес' }, 
      { label: 'Бра', searchName: 'Бра' },
      { label: 'Уличный светильник', searchName: 'Уличный светильник' },
    ],
  },
  {
    name: 'KinkLight',
    categories: [
      { label: 'Люстра', href: '/Catalog', searchName: 'Люстра' },
      { label: 'Торшер', href: '/web-1nashtange', searchName: 'Торшер' },
      { label: 'Настенный Светильник', href: '/web-1podvesnoy', searchName: 'Настенный Светильник' },
      { label: 'Светильник уличный', href: '/office-lamps', searchName: 'Светильник уличный' },
      { label: 'Подвес', href: '/decorative-lamps', searchName: 'Подвес' },
      { label: 'Бра', href: '/decorative-lamps', searchName: 'Бра' },
      { label: 'Светильник', href: '/decorative-lamps', searchName: 'Светильник' },
      { label: 'Лампа', href: '/decorative-lamps', searchName: 'Лампа' },
      { label: 'Трековый светильник', href: '/decorative-lamps', searchName: 'трековый светильник' },
      { label: 'Настенный светильник', href: '/decorative-lamps', searchName: 'настенный светильник' },
      { label: 'Шнур с перекл', href: '/decorative-lamps', searchName: 'Шнур с перекл' },
    ],
  },
  {
    name: 'EksMarket',
    categories: [
      { label: 'Люстра', searchName: 'Люстра' },
      { label: 'Люстра подвесная', searchName: 'Люстра подвесная' },
      { label: 'Подвес', searchName: 'Подвес' }, 
      { label: 'Бра', searchName: 'Бра' },
    ],
  },
  {
    name: 'LightStar',
    categories: [
      { label: 'Люстра Потолочная', searchName: 'Люстра Потолочная' },
      { label: 'Люстра подвесная', searchName: 'Люстра подвесная' },
      { label: 'Подвес', searchName: 'Подвес' }, 
      { label: 'Бра', searchName: 'Бра' },
    ],
  },
  {
    name: 'ElectroStandart',
    categories: [
      { label: 'Трековая Система', searchName: 'Трековая Система' },
      { label: 'Люстра подвесная', searchName: 'Люстра подвесная' },
      { label: 'Подвес', searchName: 'Подвес' }, 
      { label: 'Бра', searchName: 'Бра' },
      { label: 'Уличный светильник', searchName: 'Уличный светильник' },
    ],
  },
  {
    name: 'Denkirs',
    categories: [
      { label: 'Потолочная Люстра', searchName: 'Потолочная Люстра' },
      { label: 'Люстра подвесная', searchName: 'Люстра подвесная' },
      { label: 'Подвес', searchName: 'Подвес' }, 
      { label: 'Бра', searchName: 'Бра' },
      { label: 'Уличный светильник', searchName: 'Уличный светильник' },
    ],
  },
  {
    name: 'Werkel',
    categories: [
      { label: 'Выключатель', searchName: 'Выключатель' },
      { label: 'Розетка', searchName: 'Розетка' },
      { label: 'Датчик', searchName: 'Датчик' }, 
      { label: 'Провод', searchName: 'Провод' },
      { label: 'Уличный светильник', searchName: 'Уличный светильник' },
    ],
  },
];

const Catalog: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<Brand>(brands[0]);
  const [products, setProducts] = useState<ProductI[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<Category>(selectedBrand.categories[0]);
  const [minPrice, setMinPrice] = useState<number>(10);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState<boolean>(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const brandDropdownRef = useRef<HTMLDivElement>(null);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Fetch products
  async function fetchProducts(page: number, name: string) {
    setLoading(true);
    const res = await fetch(
      `https://palermo-light-backend-main.vercel.app/api/products/${selectedBrand.name}?page=${page}&limit=20&name=${name}&minPrice=${minPrice}&maxPrice=${maxPrice}`
    );
    const data = await res.json();
    setProducts(data.products);
    setTotalPages(data.totalPages);
    setLoading(false);
  }

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    setShowCategoryDropdown(false);
  };

  const handleBrandChange = (brand: Brand) => {
    setSelectedBrand(brand);
    setSelectedCategory(brand.categories[0]);
    setCurrentPage(1);
    setShowBrandDropdown(false);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<number>>) => {
    // Пока пользователь двигает ползунок, ничего не делаем
  };
  
  const handlePriceChangeComplete = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter(parseFloat(e.target.value));
  };

  useEffect(() => {
    fetchProducts(currentPage, selectedCategory.searchName);
  }, [currentPage, selectedCategory, minPrice, maxPrice, selectedBrand]);

  useEffect(() => {
    fetchProducts(1, selectedCategory.searchName);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target as Node)) {
        setShowBrandDropdown(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <>
    <div className="flex flex-col items-center justify-start mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 w-full max-w-screen-xl">
     
        <Toaster position="top-center" richColors />
        <div className="flex flex-col md:flex-row w-full gap-6 md:gap-8 lg:gap-10 xl:gap-12 mt-8">

          {/* Favorite Component */}
          <div className="w-full md:w-1/3 lg:w-1/2 h-auto bg-black lg:mt-28  p-4 md:p-6 rounded-lg space-y-4 order-2 md:order-1">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <ClipLoader color="#FFFFFF" loading={loading} size={50} />
              </div>
            ) : products.length > 0 ? (
              <Favorite />
          
            ) : (
              <p className="text-white text-center">Нет доступных товаров</p>
            )}
            <FilterOptions />
          </div>

          {/* Filters */}
          <div className="w-full  max-lg:mt-48 max-lg:-ml-44 max-md:ml-0 md:w-2/3 lg:w-1/2 h-auto bg-black lg:mt-28  max-md:mt-24 lg:ml-28 p-4 md:p-6 lg:p-8 rounded-lg space-y-4 order-1 md:order-2">
            <div className="bg-gradient-to-b from-neutral-900 to-black p-6 rounded-lg shadow-lg flex flex-col space-y-6 w-full">
              <div className="w-full">
                {/* Brand Dropdown */}
                <div className="relative w-full mb-4" ref={brandDropdownRef}>
                  <button
                    className="w-full text-left text-white py-3 px-5 font-semibold rounded-md flex justify-between items-center transition-all duration-300 hover:bg-neutral-700"
                    onClick={() => {
                      setShowBrandDropdown(!showBrandDropdown);
                      setShowCategoryDropdown(false);
                    }}
                  >
                    {selectedBrand.name}
                    <span className={`transition-transform transform ${showBrandDropdown ? 'rotate-180' : 'rotate-0'}`}>
                      <ChevronDown color="white" size={24} />
                    </span>
                  </button>
                  <AnimatePresence>
                    {showBrandDropdown && (
                      <motion.div
                        className="absolute left-0 mt-2 w-full bg-neutral-600 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.2 }}
                      >
                        {brands.map((brand, index) => (
                          <button
                            key={index}
                            className="w-full text-left text-white py-3 px-5 from-neutral-900 transition-colors duration-200"
                            onClick={() => handleBrandChange(brand)}
                          >
                            {brand.name}
                          </button>
                        
                        ))}
                      </motion.div>
                    )}
                     
                  </AnimatePresence>
                  
                </div>
                {/* Category Dropdown */}
                <div className="relative w-full mb-4" ref={categoryDropdownRef}>
                  <button
                    className="w-full text-left text-white py-3 px-5 font-semibold rounded-md flex justify-between items-center transition-all duration-300 hover:bg-neutral-700"
                    onClick={() => {
                      setShowCategoryDropdown(!showCategoryDropdown);
                      setShowBrandDropdown(false);
                    }}
                  >
                    {selectedCategory.label}
                    <span className={`transition-transform transform ${showCategoryDropdown ? 'rotate-180' : 'rotate-0'}`}>
                      <ChevronDown color="white" size={24} />
                    </span>
                  </button>
                  <AnimatePresence>
                    {showCategoryDropdown && (
                      <motion.div
                        className="absolute left-0 mt-2 w-full bg-neutral-600 rounded-md shadow-lg z-10 max-h-60 overflow-y-auto"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.2 }}
                      >
                        {selectedBrand.categories.map((category, index) => (
                          <button
                            key={index}
                            className="w-full text-left text-white py-3 px-5 hover:bg-gray-700 transition-colors duration-200"
                            onClick={() => handleCategoryChange(category)}
                          >
                            {category.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Price Range */}
                <div className="flex flex-col items-center mt-6 w-full">
                  <div className="w-full flex flex-col items-center space-y-2 mb-2">
                    <div className="flex justify-between w-full text-white text-sm mb-1">
                      <span>Мин: {minPrice} ₽</span>
                      <span>Макс: {maxPrice} ₽</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={1000000}
                      value={minPrice}
                      onChange={(e) => setMinPrice(parseFloat(e.target.value))}
                      className="w-full accent-white hover:bg-neutral-700"
                    />
                    <input
                      type="range"
                      min={10}
                      max={1000000}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                      className="w-full accent-white hover:bg-neutral-700"
                    />
                  </div>
                  <div className="flex justify-between w-full mt-4">
                    <input
                      type="number"
                      step="0.01"
                      value={minPrice}
                      onChange={(e) => handlePriceChange(e, setMinPrice)}
                      className="w-1/2 px-3 py-2 text-white bg-black border-2 border-white rounded-md shadow-sm focus:outline-none placeholder-gray-400"
                      placeholder="Мин"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={maxPrice}
                      onChange={(e) => handlePriceChange(e, setMaxPrice)}
                      className="w-1/2 px-3 py-2 text-white bg-black border-2 border-white rounded-md shadow-sm focus:outline-none ml-2 placeholder-gray-400"
                      placeholder="Макс"
                    />
                  </div>
                </div>
              </div>
              <FilterSed />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col w-full mt-8 md:mt-4">
          
          <div className="relative md:w-3/4 lg:w-3/4 bg-black p-4 md:p-6 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <ClipLoader color="#FFFFFF" loading={loading} size={50} />
                </div>
              ) : products.length > 0 ? (
                <CatalogOfProducts products={products} />
              ) : (
                <p className="text-white text-center">Нет доступных товаров</p>
              )}
            </motion.div>
            <motion.div
              className="mt-8 md:mt-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeInOut', delay: 0.3 }}
            >
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </motion.div>
            
          </div>
        </div>
      </div>

      <ZigzagProgressBar />
    </>
  );
};

export default Catalog;
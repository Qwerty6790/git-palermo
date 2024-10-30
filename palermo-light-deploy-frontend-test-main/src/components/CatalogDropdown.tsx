'use client';

import { AlignJustify, X } from 'lucide-react';
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

const DropdownMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const images: Record<string, string[]> = {
    Товары: ['/images/id1.png', '/images/id2.png', '/images/id3.png'],
    Новинки: ['/images/id4.png', '/images/id5.png', '/images/id6.png'],
    Дополнительно: ['/images/id7.png', '/images/id8.png', '/images/id9.png'],
  };

  const handleMouseEnter = (label: string): void => {
    setHoveredCategory(label);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleVideoEnd = (): void => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const renderCategories = (): JSX.Element => {
    const categories = [
      { links: [{ href: '/products', label: 'Товары' }] },
      { links: [{ href: '/products', label: 'Новинки' }] },
    ];

    return (
      <div className="grid grid-cols-1 gap-2  ">
        {categories.map((category, index) => (
          <div
            key={index}
            onMouseEnter={() => handleMouseEnter(category.links[0].label)}
            onMouseLeave={() => setHoveredCategory(null)}
            className="relative group"
          >
            <ul>
              {category.links.map((link) => (
                <li key={link.href} className="relative   pl-8 text-4xl group">
                  <span className="absolute  left-0 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 bg-transparent rounded-full transition-all duration-300 group-hover:bg-orange-200"></span>
                  <a
                    href={link.href}
                    className="block p-2 hover:text-orange-200 transition duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="lg:flex max-md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-white transition duration-300"
        >
          {isOpen ? (
            <X className="text-white" size={35} />
          ) : (
            <AlignJustify className="text-white" size={35} />
          )}
        </button>
      </div>

      <ul
        className={`fixed left-0 h-screen w-screen bg-black text-white z-10 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex justify-between p-4">
          <h2 className="text-5xl font-bold">Каталог</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-4">
          {renderCategories()}
        </div>
        {hoveredCategory && (
          <div className="flex justify-center p-4">
            <motion.div
              className="grid grid-cols-3 gap-2 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              {images[hoveredCategory]?.map((src, index) => (
                <motion.img
                  key={index}
                  src={src}
                  alt={`${hoveredCategory} ${index + 1}`}
                  className="w-full scale-125 h-auto object-cover"
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 10 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }} // Staggered entrance
                />
              ))}
            </motion.div>
          </div>
        )}
      </ul>
    </div>
  );
};

export default DropdownMenu;

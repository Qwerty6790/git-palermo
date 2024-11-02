'use client';

import { AlignJustify, X } from 'lucide-react';
import React, { useState } from 'react';

const DropdownMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const renderCategories = (): JSX.Element => {
    const categories = [
      { links: [{ href: '/products', label: 'Товары' }] },
      { links: [{ href: '/products', label: 'Новинки' }] },
    ];

    return (
      <div className="grid grid-cols-1 gap-2">
        {categories.map((category, index) => (
          <div
            key={index}
            onMouseEnter={() => setHoveredCategory(category.links[0].label)}
            onMouseLeave={() => setHoveredCategory(null)}
            className="relative group"
          >
            <ul>
              {category.links.map((link) => (
                <li key={link.href} className="relative pl-8 text-4xl group">
                  <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2.5 h-2.5 bg-transparent rounded-full transition-all duration-300  group-hover:bg-orange-200"></span>
                  <a
                    href={link.href}
                    className="block p-2 hover:text-orange-200 hover:translate-x-4 transition duration-300"
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
        className={`fixed left-0 h-screen w-screen bg-gradient-to-r from-black to-neutral-950 text-white z-10 transition-opacity duration-300 ${
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
      </ul>
    </div>
  );
};

export default DropdownMenu;

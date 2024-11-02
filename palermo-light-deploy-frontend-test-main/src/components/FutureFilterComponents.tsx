import { ChevronDown } from 'lucide-react';
import React from 'react';

const FilterSed: React.FC = () => {
  return (
    <div className='flex flex-col gap-5 max-lg:hidden max-md:hidden opacity-75'>
      <div className="flex flex-col items-center">
        {[
          "Диаметр, ММ",
          "Высота, ММ",
          "Ширина, ММ",
          "Глубина, ММ",
          "Площадь освещения, кв.м",
          "Стиль",
        ].map((label) => (
          <button
            key={label}
            className="w-full max-w-md text-left  text-white py-2 px-4 font-bold rounded-md  bg-neutral-900 flex justify-between items-center transition-transform transform hover:scale-105"
          >
            {label}
            <span className='transition-transform transform '>
              <ChevronDown className="hidden  md:block" color="white" size={22} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterSed;

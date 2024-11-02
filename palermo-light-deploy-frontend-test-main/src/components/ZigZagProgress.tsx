'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ZigzagProgressBar: React.FC = () => {
  const [scrollPercentage, setScrollPercentage] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / documentHeight) * 100;
      setScrollPercentage(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 right-0 h-full w-2 flex flex-col items-center z-50">
      <div className="relative w-full h-full">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ width: 0 }}
            animate={{ width: `${scrollPercentage}%` }}
            transition={{
              delay: i * 0.1, // Delay each segment for a sequential appearance
              duration: 0.6,
              ease: 'easeInOut',
            }}
            className={`absolute w-full h-[10%] bg-white ${i % 2 === 0 ? 'mr-auto' : 'ml-auto'} transform ${
              i % 2 === 0 ? '-rotate-32' : 'rotate-12'
            }`}
            style={{ top: `${i * 10}%` }}
          ></motion.div>
        ))}
      </div>
    </div>
  );
};

export default ZigzagProgressBar;

'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Slide {
  image: string;
}

const slides: Slide[] = [
  { image: './images/Denkirs air.png' },
  { image: './images/Denkirs smart.png' },
  { image: './images/Denkirs solid.png' },
];

export default function ImageHoverEffect() {
  const [currentText, setCurrentText] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [loopNum, setLoopNum] = useState<number>(0);
  const [typingSpeed, setTypingSpeed] = useState<number>(200);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [autoScrollInterval, setAutoScrollInterval] = useState<NodeJS.Timeout | null>(null);
  const [showButton, setShowButton] = useState<boolean>(false);
  const [showSubtitle, setShowSubtitle] = useState<boolean>(false);

  // Auto-scroll functionality
  useEffect(() => {
    const autoScroll = () => {
      setCurrentSlide((prev) => {
        const nextSlide = (prev + 1) % slides.length;
        setShowButton(false); // Hide button before transition
        setShowSubtitle(false); // Hide subtitle before transition
        return nextSlide;
      });
    };

    if (autoScrollInterval) clearInterval(autoScrollInterval);
    const interval = setInterval(autoScroll, 5000); // Change slide every 5 seconds
    setAutoScrollInterval(interval);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Show button and subtitle after slide transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true);
      setShowSubtitle(true);
    }, 500); // Delay for the transition

    return () => clearTimeout(timer);
  }, [currentSlide]);

  // Framer Motion settings for entrance animation
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 1, ease: 'easeOut' },
    },
  };

  const slideVariants = {
    initial: { opacity: 0, x: 100 },
    enter: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeInOut' } },
    exit: { opacity: 0, x: -100, transition: { duration: 0.5, ease: 'easeInOut' } },
  };

  return (
    <motion.div
      className="relative  bg-black w-full mt-36 flex items-center justify-center h-[500px]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="relative -mt-36 e w-screen h-[350px] overflow-hidden">
        <div className="group relative w-full h-full cursor-pointer">
          <motion.div
            key={currentSlide}
            variants={slideVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="absolute inset-0 w-[1400px] lg:w-full lg:h-full"
          >
            <motion.img
              src={slides[currentSlide].image}
              alt={`Slide ${currentSlide + 1}`}
              className="w-full h-full object-cover rounded-lg" // Add 'rounded-lg' for rounded corners
            />
          </motion.div>

          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center opacity-100 transition-opacity duration-500 ease-in-out z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <div className="text-center rounded-full text-white lg:mt-24 text-6xl font-bold mt-8"></div>
          </motion.div>

          <div className="absolute max-md:hidden text-white text-2xl inset-0 lg:mt-64 flex flex-col items-center justify-center font-bold transition-opacity duration-400 z-30">
            <div className="text-center">{currentText}</div>
            <span className="border-r-2 border-black ml-1 animate-pulse"></span>
          </div>
          {/* Pagination indicators */}
          <div className="absolute bottom-10 lg:bottom-20   left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3  rounded-full ${currentSlide === index ? 'bg-white' : 'bg-black'}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            className="absolute left-4 text-6xl top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full z-30"
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          >
            &#10094; {/* Left arrow */}
          </button>
          <button
            className="absolute right-4 text-6xl top-1/2 transform -translate-y-1/2 text-white p-2 rounded-full z-30"
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          >
            &#10095; {/* Right arrow */}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

'use client'
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ImageHoverEffect from '../components/DenkirsBanner';
import Denkirs from '@/components/DenkirsNews/page';  
import { ClipLoader } from 'react-spinners';




export default function Home() {
  const [loading, setLoading] = useState<boolean>(true); // Initialize loading state

  useEffect(() => {
    // Simulate data fetching delay for demonstration purposes
    const timeout = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timeout); // Clear timeout if component unmounts
  }, []);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col  items-center w-full px-4"> {/* Full-width container */}
      <motion.div
        className="w-full lg:mt-10 flex flex-col items-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        transition={{ duration: 0.5 }}
      >
        <ImageHoverEffect />
      
        {/* Denkirs Products Section */}
        <motion.div
          className="-mt-20 w-full max-w-[1635px]" // Adjust width for mobile
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }} // Slight delay for stagger effect
        >{loading ? (
          <div className="flex justify-center items-center h-full">
            <ClipLoader color="#FFFFFF" loading={loading} size={50} />
          </div>
        ) :  (
          <><>
                <Denkirs />
              </></>
        )}

       
        </motion.div>
      </motion.div>
    </div>


  );
};


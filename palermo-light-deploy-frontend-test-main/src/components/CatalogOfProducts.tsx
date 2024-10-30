import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Toaster, toast } from 'sonner';

export interface ProductI {
  _id: string;
  article: string;
  name: string;
  price: number;
  imageAddress: string;
  source: string;
  stock: string;
}

interface CatalogOfProductsProps {
  products: ProductI[];
}

// Utility function to extract numeric stock value
const getStockCount = (stock: string): number => {
  const match = stock.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

export const CatalogOfProducts: React.FC<CatalogOfProductsProps> = ({ products }) => {
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    const storedCartCount = localStorage.getItem('cartCount');
    if (storedCartCount) {
      setCartCount(Number(storedCartCount));
    }
  }, []);

  const addToCart = (productId: string, supplier: string) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '{"products": []}');
    const existingProductIndex = cart.products.findIndex((item: any) => item.productId === productId);

    if (existingProductIndex > -1) {
      cart.products[existingProductIndex].quantity += 1;
    } else {
      cart.products.push({ productId, supplier, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cartCount
    setCartCount((prevCount) => {
      const newCount = prevCount + 1;
      localStorage.setItem('cartCount', newCount.toString());
      return newCount;
    });

    // Show toast notification
    toast.success('Товар добавлен в корзину');
  };

  return (
    <div className="grid grid-cols-2 lg:w-[1500px] lg:-ml-[350px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-5">
      {products.map((product) => {
        const stockCount = getStockCount(product.stock);
        const stockClass = stockCount > 0 ? 'text-green-500' : 'text-red-500';

        return (
          <div key={product._id} className="relative shadow-lg shadow-zinc-900 transition duration-500 cursor-pointer bg-white border border-zinc-700 rounded-lg overflow-hidden">
            <Link href={`/products/${product.source}/${product._id}`} passHref>
              <img
                className="w-full h-48 sm:h-56 md:h-64 object-cover"
                src={product.imageAddress}
                alt={product.name}
              />
            </Link>
            <div className="p-4 bg-white">
              <h2 className="text-black text-lg font-semibold truncate">{product.name}</h2>
              <p className="font-bold text-black text-xl text-gradient-to-b from-zinc-300 to-black mt-1">
                {product.price} ₽
              </p>
              <div className="flex justify-between items-center mt-4">
                <div className={`text-sm ${stockClass}`}>
                  <p>Остаток: {stockCount} шт.</p>
                </div>
                <button
                  className={`border transition duration-500 py-1 rounded-md w-24 ${
                    stockCount === 0 ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'hover:bg-black hover:text-white'
                  }`}
                  onClick={() => {
                    if (stockCount > 0) {
                      addToCart(product._id, product.source);
                    }
                  }}
                  disabled={stockCount === 0} // Disable button if stock is 0
                >
                  <p>В Корзину</p>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

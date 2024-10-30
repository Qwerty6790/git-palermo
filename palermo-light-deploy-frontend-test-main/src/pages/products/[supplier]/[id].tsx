import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import 'tailwindcss/tailwind.css';
import Header from '@/components/Header';
import { Toaster, toast } from 'sonner';
import { ClipLoader } from 'react-spinners';

interface ProductI {
  _id: string; 
  article: string;
  name: string;
  price: number;
  stock: string;
  imageAddress: string;
  source: string;
}

const ProductDetail: React.FC = () => {
  const router = useRouter();
  const { supplier, id } = router.query;

  const [product, setProduct] = useState<ProductI | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !supplier || !id) return;

    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://palermo-light-backend-main.vercel.app/api/products/${supplier}/${id}`);
        if (!response.ok) throw new Error('Ошибка загрузки данных о товаре');
        const data: ProductI = await response.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [supplier, id, isMounted]);

  const extractStock = (stock: string): number => {
    const match = stock.match(/\d+/); // Находит первое число в строке
    return match ? parseInt(match[0], 10) : 0; // Возвращает число или 0, если нет
  };

  const addToCart = (productId: string, supplier: string) => {
    if (!product) {
      toast.error('Товар не найден');
      return;
    }

    const stockCount = extractStock(product.stock);

    if (stockCount <= 0) {
      toast.error('Товар закончился');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '{"products": []}');
    const existingProductIndex = cart.products.findIndex((item: any) => item.productId === productId);

    if (existingProductIndex > -1) {
      cart.products[existingProductIndex].quantity += 1;
    } else {
      cart.products.push({ productId, supplier, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    const currentCartCount = parseInt(localStorage.getItem('cartCount') || '0', 10);
    localStorage.setItem('cartCount', (currentCartCount + 1).toString());

    toast.success('Товар добавлен в корзину');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <ClipLoader color="#FFFFFF" loading={loading} size={50} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <p>Товар не найден</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Toaster position="top-center" richColors />
      <Header />
      <div className="flex justify-center mt-40 items-center flex-1 p-6">
        <div className="bg-black rounded-lg shadow-lg flex flex-col md:flex-row max-w-4xl w-full">
          <img
            className="w-full md:w-2/3 h-auto object-cover rounded-lg"
            src={product.imageAddress}
            alt={product.name}
          />
          <div className="w-full md:w-1/2 flex flex-col justify-between p-6">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-500 py-4">
                {product.name}
              </h1>
              <p className="text-xl text-gray-300 font-semibold mt-2">{product.price} ₽</p>
              <p className="text-sm text-white mt-2">Артикул: {product.article}</p>
              <p className="text-sm text-white mt-2">Остаток: {product.stock} шт.</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => addToCart(product._id, product.source)}
                className="bg-blue-600 text-white py-3 px-6 rounded-md transition duration-500 hover:bg-blue-700 w-full"
              >
                В Корзину
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

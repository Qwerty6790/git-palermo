'use client'; 
import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import { CircleUser, Search, ShoppingBasket, LogOut , LogIn, Home, Info, Box, Tag } from 'lucide-react';
import DropdownMenu from './CatalogDropdown';
import Login from '@/app/auth/login/page';
import TopHeader from './TopHeader';

interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode; // Используем React.ReactNode для иконок
}

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showTopRow, setShowTopRow] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>(''); // Состояние для поискового запроса
  const navRef = useRef<HTMLUListElement | null>(null);

  const navLinks: NavLink[] = [
    { label: 'На карте', href: 'https://yandex.ru/maps/org/vamlyustra/57825106234/?ll=37.710310%2C55.582662&mode=search&sll=37.710310%2C55.582623&source=serp_navig&text=%D0%B2%D0%B0%D0%BC%D0%BB%D1%8E%D1%81%D1%82%D1%80%D0%B0&z=12', icon: <Home size={20} /> },
    { label: 'О нас', href: '/about', icon: <Info size={20} /> },
    { label: 'Профиль', href: '/profile', icon: <CircleUser size={20} /> },
    { label: 'Каталог', href: '/products', icon: <ShoppingBasket size={20} /> }
  ];

  useEffect(() => {
    const storedCartCount = localStorage.getItem('cartCount');
    setCartCount(storedCartCount ? Number(storedCartCount) : 0);
    setIsLoggedIn(!!localStorage.getItem('token'));

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowTopRow(scrollY <= 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery) {
      // Перенаправление на страницу поиска
      window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className={clsx('fixed border-b bg-gradient-to-r from-black to-neutral-950 w-full shadow-md z-50')}>
      <TopHeader />
      <div className="container mx-auto py-6 px-5">
        <div className={clsx('transition-opacity duration-300', showTopRow ? 'opacity-100' : 'opacity-0', showTopRow ? 'h-auto' : 'h-0 overflow-hidden')}>
        <div className="flex justify-between items-center text-white mb-4">
  <div className="flex flex-wrap max-md:hidden gap-8"> {/* Change gap to a smaller value for more spacing */}
    <a href="mailto:davidmonte00@mail.ru" className="text-sm">davidmonte00@mail.ru</a>
    <a href="tel:+79296748380" className="text-sm">+7 (929) 674-83-80</a>
    <a href="tel:+79349992909" className="text-sm">+7 (934) 999-29-09</a>
    <span className="text-sm max-lg:hidden">Новости</span>
    <span className="text-sm max-lg:hidden">Разные новинки каждый месяц</span>
    <span className='text-sm'>г.Москва</span>
  </div>
  
  <div className="flex items-center space-x-4">
    <form className="hidden md:flex items-center" onSubmit={handleSearchSubmit}>
      <div className="relative">
        <input
          className="border-white bg-transparent text-white rounded-lg py-2 pl-10 pr-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neutral-50 focus:border-transparent transition duration-300"
          type="text"
          placeholder="Поиск..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
      </div>
      <button type="submit" className="bg-white text-black rounded-lg px-4 py-2 ml-2 hover:bg-gray-200 transition duration-300">
        Поиск
      </button>
    </form>
  </div>
</div>
        </div>

        <div className="flex items-center justify-between">
          <a className="text-3xl font-bold text-white" href="/">
            PalermoLight
          </a>

          <div className="hidden ml-10 md:flex items-center space-x-8">
            <DropdownMenu />
            <nav ref={navRef} className="flex  space-x-8 items-center">
              {navLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="flex items-center font-medium text-white hover:text-gray-300 transition duration-300   py-2 rounded-lg hover:bg-neutral-700"
                >
                  {item.icon} {/* Иконка добавлена здесь */}
                  <span className="ml-2">{item.label}</span>
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <a href="/cart" className="text-white hover:text-gray-300 transition duration-300 flex items-center">
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-2">
                  {cartCount}
                </span>
                <ShoppingBasket size={26} />
              </a>
            </div>
            <div className="flex items-center space-x-2">
              {isLoggedIn ? (
                <>
                  <span className="text-white">Пользователь</span>
                  <button onClick={handleLogout} className="text-white max-md:hidden  hover:text-gray-300 transition duration-300">
                  <LogOut size={23} />
                  </button>
                </>
              ) : (
                <a href="/auth/register" className="text-white max-md:hidden hover:text-gray-300 transition duration-300">
                 <LogIn size={23} />
                </a>
              )}
            </div>
            <button className="lg:hidden z-20 mx-5 items-center bg-white rounded-es-xl flex" onClick={() => setIsOpen(prevState => !prevState)}>
              <img
                src={`./images/${isOpen ? "close" : "grid"}.svg`}
                alt="menu toggle"
                className="object-contain w-8 h-8"
              />
            </button>
          </div>
        </div>
      </div>

      <div className={clsx('fixed top-0 left-0 w-full h-full bg-black transition-transform duration-300', isOpen ? 'translate-x-0' : 'translate-x-[-100%]')}>
        <nav className="flex flex-col gap-10 items-center justify-center h-full">
          <ul className="flex flex-col items-center space-y-4">
            {navLinks.map((item) => (
              <li key={item.label} className="text-white text-lg">
                <a href={item.href} className="flex items-center px-4 py-2 transition duration-300 hover:bg-gray-700 rounded">
                  {item.icon && <span className="mr-2">{item.icon}</span>} {/* Иконка добавлена здесь */}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <button className="mt-5 text-white underline" onClick={() => setIsOpen(false)}>Закрыть меню</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;

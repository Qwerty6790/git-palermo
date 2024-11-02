const [minPrice, setMinPrice] = useState<number>(10);
  const [maxPrice, setMaxPrice] = useState<number>(1000000);


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
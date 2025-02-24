const FavouriteCities = ({ favoriteCities, fetchWeather }) => {
  return (
    <div className="mt-4 p-4 bg-white text-black rounded-lg shadow-md w-80">
      <h3 className="text-lg font-semibold mb-2">⭐ Любими градове</h3>
      {favoriteCities.length > 0 ? (
        <ul>
          {favoriteCities.map((city, index) => (
            <li
              key={index}
              className="cursor-pointer p-2 border-b border-gray-300 hover:bg-gray-200"
              onClick={() => fetchWeather(city)}
            >
              {city.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Няма запазени градове.</p>
      )}
    </div>
  );
};

export default FavouriteCities;

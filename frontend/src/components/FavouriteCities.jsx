const FavouriteCities = ({
  favoriteCities,
  setFavoriteCities,
  fetchWeather,
}) => {
  const removeFavorite = (city) => {
    const updatedFavorite = favoriteCities.filter(
      (fav) => fav.name !== city.name
    );

    setFavoriteCities(updatedFavorite);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorite));
  };
  return (
    <div className=" p-4 bg-white text-black rounded-lg shadow-md w-80">
      <h3 className="text-lg font-semibold mb-2">⭐ Любими градове</h3>
      {favoriteCities.length > 0 ? (
        <ul>
          {favoriteCities.map((city, index) => (
            <li
              key={index}
              className="cursor-pointer p-2 border-b border-gray-300 flex justify-between hover:bg-gray-200"
              onClick={() => fetchWeather(city)}
            >
              {city.name}
              <button
                onClick={() => removeFavorite(city)}
                className="bg-red-500 px-2 py-1 cursor-pointer text-white rounded"
              >
                ❌ Премахни
              </button>
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

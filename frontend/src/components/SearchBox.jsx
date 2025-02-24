import { useState } from "react";

const SearchBox = ({ query, setQuery, suggestions, fetchWeather }) => {
  return (
    <div className="flex flex-col items-center">
      <input
        type="text"
        placeholder="Enter city..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="p-3 border border-gray-600 rounded-lg mb-4 w-80 text-black bg-white shadow-md"
      />
      {suggestions.length > 0 && (
        <ul className="bg-white text-black border rounded-lg w-80 max-h-40 overflow-y-auto shadow-md">
          {suggestions.map((city, index) => (
            <li
              key={index}
              onClick={() => fetchWeather(city)}
              className="cursor-pointer p-2 hover:bg-gray-200"
            >
              {city.name}, {city.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;

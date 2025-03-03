import { useState } from "react";
import { FaSearch } from "react-icons/fa"; // Добавяме икона за търсене
import { IoMdClose } from "react-icons/io"; // Добавяме икона за изчистване

const SearchBox = ({ query, setQuery, suggestions, fetchWeather }) => {
  return (
    <div className="flex flex-col items-center relative">
      <div className="flex items-center border border-gray-600 rounded-lg bg-white shadow-md w-80">
        <FaSearch className="text-gray-500 mx-2" />
        <input
          type="text"
          placeholder="Въведете град..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="p-3 w-full text-black bg-white border-none outline-none"
        />
        {query && (
          <IoMdClose
            className="text-gray-500 mx-2 cursor-pointer hover:text-red-500"
            onClick={() => setQuery("")}
          />
        )}
      </div>

      {suggestions.length > 0 && (
        <ul className="bg-white text-black border rounded-lg w-80 max-h-40 overflow-y-auto shadow-md absolute top-full mt-1 z-50">
          <li className="p-2 text-gray-600 font-semibold border-b">
            Намерени резултати: {suggestions.length}
          </li>
          {suggestions.map((city, index) => (
            <li
              key={index}
              onClick={() => fetchWeather(city)}
              className="cursor-pointer p-2 hover:bg-gray-200 flex items-center gap-2"
            >
              <img
                src={`https://flagcdn.com/w40/${city.country.toLowerCase()}.png`}
                alt={city.country}
                className="w-6 h-4"
              />
              {city.name}, {city.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;

import React from "react";

interface SearchBarProps {
  onSearch: (search: string) => void;
}

function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <label htmlFor="search" className="w-full ">
      <input
        type="text"
        name="search"
        id="search-bar"
        className="border w-full h-full border-primary/20 rounded-md px-4 py-1"
        placeholder="🔎 بحث"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onSearch(e.target.value)
        }
      />
    </label>
  );
}

export default SearchBar;

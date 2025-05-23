"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { ShowMobileMenuProps } from "@types";

import { IoSearch } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

const SearchBar = ({
  widthClass,
  margin,
  isShowMobileMenu,
  setIsShowMobileMenu
}: {widthClass: string; margin: string;} & ShowMobileMenuProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async () => {
    const query = searchQuery.trim().replace(/\s/g, "-");

    if (!query)
      return;

    setSearchQuery("");

    if (isShowMobileMenu && setIsShowMobileMenu) setIsShowMobileMenu(false);

    router.push(`/search?query=${query}`);
  };

  const handleEnterSearch = (e: React.KeyboardEvent) => {
    const target = e.target as HTMLElement;

    if (e.key === "Enter" && searchQuery) {
      target.blur();
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div
      className={`${widthClass} ${margin} bg-light px-1.5 
        border border-gray-700 shadow-lg flex items-center`}
    >
      <input
        type="text"
        placeholder="Search"
        className="search-input !rounded-none !border-none"
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
        onKeyUp={(e) => handleEnterSearch(e)}
      />

      {searchQuery && (
        <RxCross2
          className="mr-1 text-2xl max-sm:text-3xl text-danger hover:text-red-500 cursor-pointer"
          onClick={() => handleClearSearch()}
        />
      )}

      <IoSearch
        className={`text-xl max-sm:text-2xl text-dark hover:text-light-2 cursor-pointer ${
          !searchQuery && "pointer-events-none"
        }`}
        onClick={() => handleSearch()}
      />
    </div>
  );
};

export default SearchBar;

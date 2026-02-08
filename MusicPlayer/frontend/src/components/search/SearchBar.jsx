import React from "react";

const SearchBar = () => {
  return (
    <input
      type="text"
      placeholder="Search songs..."
      style={{
        padding: "8px",
        width: "100%",
        borderRadius: "6px",
      }}
    />
  );
};

export default SearchBar;

import React from 'react';
import { Input } from "@/components/ui/input";

const SearchBar = ({ searchTerm, onSearchChange }) => (
  <div className="mb-4">
    <Input
      type="text"
      placeholder="Search events..."
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
      className="w-full"
    />
  </div>
);

export default SearchBar;

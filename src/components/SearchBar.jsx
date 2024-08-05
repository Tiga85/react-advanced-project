import { Input } from "@chakra-ui/react";

export const SearchBar = ({ onSearch }) => {
  const handleInputChange = (event) => {
    onSearch(event.target.value);
  };

  return (
    <Input placeholder="Search events by title" onChange={handleInputChange} />
  );
};

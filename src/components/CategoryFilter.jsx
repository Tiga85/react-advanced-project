import { useState } from "react";
import { Button, Box, Stack } from "@chakra-ui/react";

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onFilterChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleCategoryClick = (categoryId) => {
    onFilterChange(categoryId);
    setIsOpen(false);
  };

  return (
    <Box>
      <Button onClick={toggleDropdown}>
        {isOpen ? "Select Category ▼" : "Select Category ►"}
      </Button>
      {isOpen && (
        <Stack mt={2} spacing={2}>
          <Button
            onClick={() => handleCategoryClick(null)}
            colorScheme={selectedCategory === null ? "blue" : "gray"}
            variant="outline"
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              colorScheme={selectedCategory === category.id ? "blue" : "gray"}
              variant="outline"
            >
              {category.name}
            </Button>
          ))}
        </Stack>
      )}
    </Box>
  );
};

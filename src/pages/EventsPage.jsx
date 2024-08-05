import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heading, Button, Stack } from "@chakra-ui/react";
import { AddEvent } from "../components/AddEvent";
import { SearchBar } from "../components/SearchBar";
import { CategoryFilter } from "../components/CategoryFilter";

export const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchEventsAndCategories = async () => {
      try {
        const eventsResponse = await fetch("http://localhost:3000/events");
        const categoriesResponse = await fetch(
          "http://localhost:3000/categories"
        );

        if (!eventsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Network response was not ok");
        }

        const eventsData = await eventsResponse.json();
        const categoriesData = await categoriesResponse.json();

        setEvents(eventsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch events and categories:", error);
      }
    };
    fetchEventsAndCategories();
  }, []);

  const handleEventAdded = (newEvent) => {
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === null ||
      event.categoryIds.includes(parseInt(selectedCategory));

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <Heading>List of events</Heading>
      <br />
      <br />

      <Button onClick={() => setIsModalOpen(true)}>Add Event</Button>
      <br />
      <br />
      <Stack spacing={4}>
        <SearchBar onSearch={handleSearch} />

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onFilterChange={handleFilterChange}
        />
      </Stack>
      <ul>
        {filteredEvents.map((event) => (
          <li key={event.id}>
            <Link to={`/event/${event.id}`}>
              <br />
              <br />
              <h2>{event.title}</h2>
              <p>{event.description}</p>
              <img src={event.image} alt={event.title} />
              <p>Start Time: {new Date(event.startTime).toLocaleString()}</p>
              <p>End Time: {new Date(event.endTime).toLocaleString()}</p>
              <p>
                Categories:{" "}
                {event.categoryIds ? event.categoryIds.join(", ") : ""}
              </p>
            </Link>
          </li>
        ))}
      </ul>
      <AddEvent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEventAdded={handleEventAdded}
      />
    </div>
  );
};

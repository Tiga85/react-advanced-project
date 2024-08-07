import { useState, useEffect } from "react";
import { Heading, Button, useToast } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { EditEvent } from "../components/EditEvent";
import { DeleteEvent } from "../components/DeleteEvent";

export const EventPage = ({ onEventDeleted }) => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isDeleting, setIsDeleting] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventResponse = await fetch(
          `http://localhost:3000/events/${eventId}`
        );
        const usersResponse = await fetch("http://localhost:3000/users");
        const categoriesResponse = await fetch(
          "http://localhost:3000/categories"
        );

        if (!eventResponse.ok) {
          const errorText = await eventResponse.text();
          throw new Error(
            `Failed to fetch event data: ${eventResponse.status} ${errorText}`
          );
        }
        if (!usersResponse.ok) {
          const errorText = await usersResponse.text();
          throw new Error(
            `Failed to fetch users data: ${usersResponse.status} ${errorText}`
          );
        }
        if (!categoriesResponse.ok) {
          const errorText = await categoriesResponse.text();
          throw new Error(
            `Failed to fetch categories data: ${categoriesResponse.status} ${errorText}`
          );
        }

        const eventData = await eventResponse.json();
        const usersData = await usersResponse.json();
        const categoriesData = await categoriesResponse.json();

        setEvent(eventData);
        setUsers(usersData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchData();
  }, [eventId, toast]);

  if (!event) return <Heading>Loading...</Heading>;

  const handleEdit = () => {
    setFormData(event);
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setEvent(formData);
        setIsEditing(false);
        toast({
          title: "Event updated.",
          description: "The event details have been successfully updated.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error("Failed to update event");
      }
    } catch (error) {
      toast({
        title: "Error updating event.",
        description: "There was an error updating the event details.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Event deleted.",
          description: "The event has been successfully deleted.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        onEventDeleted();
      } else {
        throw new Error("Failed to delete event");
      }
    } catch (error) {
      toast({
        title: "Error deleting event.",
        description: "There was an error deleting the event.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const creator = users.find((user) => user.id === String(event?.createdBy));
  const eventCategories =
    event?.categoryIds.length > 0
      ? event?.categoryIds.map(
          (id) => categories.find((cat) => cat.id === id)?.name
        )
      : [];

  return (
    <div>
      {event && (
        <>
          <Heading>{event.title}</Heading>
          <p>{event.description}</p>
          <img src={event.image} alt={event.title} />
          <p>
            <strong>Start Time:</strong>{" "}
            {new Date(event.startTime).toLocaleString()}
          </p>
          <p>
            <strong>End Time:</strong>{" "}
            {new Date(event.endTime).toLocaleString()}
          </p>
          <br />
          <div>
            <h3>Created by:</h3>
            <img src={creator?.image} alt={creator?.name} />
            <p>{creator?.name}</p>
          </div>
          <Button onClick={handleEdit}>Edit</Button>
          <Button colorScheme="red" onClick={() => setIsDeleting(true)}>
            Delete
          </Button>
        </>
      )}

      <EditEvent
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        formData={formData}
        setFormData={setFormData}
        handleSave={handleSave}
      />

      <DeleteEvent
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        handleDelete={handleDelete}
      />
    </div>
  );
};

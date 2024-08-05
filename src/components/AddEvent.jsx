import { useState } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";

export const AddEvent = ({ isOpen, onClose, onEventAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [categoryIds, setCategoryIds] = useState("");

  const handleSubmit = async () => {
    const newEvent = {
      title,
      description,
      image,
      location,
      startTime,
      endTime,
      categoryIds: categoryIds.split(",").map((id) => parseInt(id.trim())),
    };

    try {
      const response = await fetch("http://localhost:3000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        throw new Error("Failed to add event");
      }

      const addedEvent = await response.json();
      onEventAdded(addedEvent);
      onClose(); // Close the modal
      // Clear the form
      setTitle("");
      setDescription("");
      setImage("");
      setLocation("");
      setStartTime("");
      setEndTime("");
      setCategoryIds("");
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add New Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Image URL</FormLabel>
            <Input value={image} onChange={(e) => setImage(e.target.value)} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Location</FormLabel>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Start Time</FormLabel>
            <Input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>End Time</FormLabel>
            <Input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Category IDs (comma separated)</FormLabel>
            <Input
              value={categoryIds}
              onChange={(e) => setCategoryIds(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

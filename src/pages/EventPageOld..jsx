i want to devide this code into 3 new components,  one for edit code , and one for delete code?? and the rest EventPage component Ui should remain there??

import React, { useState, useEffect } from 'react';
import { Heading, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, useToast } from '@chakra-ui/react';

export const EventPage = ({ eventId, onEventDeleted }) => {
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
        const eventResponse = await fetch(`http://localhost:3000/events/${eventId}`);
        const usersResponse = await fetch('http://localhost:3000/users');
        const categoriesResponse = await fetch('http://localhost:3000/categories');
    
        if (!eventResponse.ok) {
          throw new Error('Failed to fetch event data');
        }
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users data');
        }
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories data');
        }
    
        const eventData = await eventResponse.json();
        const usersData = await usersResponse.json();
        const categoriesData = await categoriesResponse.json();
    
        setEvent(eventData);
        setUsers(usersData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
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
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setEvent(formData);
        setIsEditing(false);
        toast({
          title: 'Event updated.',
          description: 'The event details have been successfully updated.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error('Failed to update event');
      }
    } catch (error) {
      toast({
        title: 'Error updating event.',
        description: 'There was an error updating the event details.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Event deleted.',
          description: 'The event has been successfully deleted.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        // Notify parent component to handle redirection
        onEventDeleted();
      } else {
        throw new Error('Failed to delete event');
      }
    } catch (error) {
      toast({
        title: 'Error deleting event.',
        description: 'There was an error deleting the event.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const creator = users.find(user => user.id === event?.createdBy);
  const eventCategories = event?.categoryIds.length > 0 ?
  event?.categoryIds.map(id => categories.find(cat => cat.id === id)?.name) :
  [];
  return (

    <div>
      {event && (
        <>
          <Heading>{event.title}</Heading>
          <p>{event.description}</p>
          <img src={event.image} alt={event.title} />
          <p><strong>Start Time:</strong> {new Date(event.startTime).toLocaleString()}</p>
          <p><strong>End Time:</strong> {new Date(event.endTime).toLocaleString()}</p>
          <p><strong>Categories:</strong> {eventCategories.join(', ')}</p>
          <div>
            <h3>Created by:</h3>
            <img src={creator?.image} alt={creator?.name} />
            <p>{creator?.name}</p>
          </div>
          <Button onClick={handleEdit}>Edit</Button>
          <Button colorScheme="red" onClick={() => setIsDeleting(true)}>Delete</Button>
        </>
      )}

      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            </FormControl>
            <FormControl>
              <FormLabel>Description</FormLabel>
              <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </FormControl>
            <FormControl>
              <FormLabel>Image URL</FormLabel>
              <Input value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} />
            </FormControl>
            <FormControl>
              <FormLabel>Start Time</FormLabel>
              <Input type="datetime-local" value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} />
            </FormControl>
            <FormControl>
              <FormLabel>End Time</FormLabel>
              <Input type="datetime-local" value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSave}>Save</Button>
            <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isDeleting} onClose={() => setIsDeleting(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this event? This action cannot be undone.
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDelete}>Delete</Button>
            <Button variant="ghost" onClick={() => setIsDeleting(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
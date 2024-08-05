import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';

export const EditEvent = ({ isOpen, onClose, formData, setFormData, handleSave }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};



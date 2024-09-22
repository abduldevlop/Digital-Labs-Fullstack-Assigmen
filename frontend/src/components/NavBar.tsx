import React, { useState } from "react";
import {
  Navbar,
  Nav,
  Container,
  Button,
  Modal,
  Form,
  Spinner,
} from "react-bootstrap";
import { useApi } from "../context/ApiContext";

interface NavBarProps {
  onEventCreated: () => void; // Add this prop
}

const NavBar: React.FC<NavBarProps> = ({ onEventCreated }) => {
  const { user, handleGoogleLogin, handleLogout } = useApi();
  const [showModal, setShowModal] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    title: "",
    dateTime: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEventDetails({ ...eventDetails, [name]: value });
  };

  const handleCreateEvent = async () => {
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await user?.getIdToken()}`,
        },
        body: JSON.stringify(eventDetails),
      });

      if (response.ok) {
        console.log("Event created successfully");
        onEventCreated(); // Refresh the events list
        handleCloseModal();
        setEventDetails({ title: "", dateTime: "", description: "" });
      } else {
        console.error("Failed to create event:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating event:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">Calendar App</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto"></Nav>
            <div className="d-flex align-items-center">
              {!user ? (
                <Button variant="primary" onClick={handleGoogleLogin}>
                  Sign in with Google
                </Button>
              ) : (
                <>
                  <span className="me-3">Welcome, {user.displayName}</span>
                  <Button
                    variant="success"
                    className="me-2"
                    onClick={handleShowModal}
                  >
                    Create Event
                  </Button>
                  <Button variant="danger" onClick={handleLogout}>
                    Log Out
                  </Button>
                </>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEventTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={eventDetails.title}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formEventDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={eventDetails.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formEventDateTime">
              <Form.Label>Date and Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="dateTime"
                value={eventDetails.dateTime}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
          {loading && (
            <div className="text-center mt-3">
              <Spinner animation="border" variant="primary" />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateEvent}>
            Create Event
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NavBar;

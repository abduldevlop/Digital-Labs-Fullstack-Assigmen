import { useEffect, useState } from "react";
import Event from "./components/Event";
import NavBar from "./components/NavBar";
import { Spinner, Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useApi } from "./context/ApiContext";

interface EventType {
  id: string;
  title: string;
  dateTime: string;
  description: string;
  userId: string;
}

const App: React.FC = () => {
  const { user } = useApi();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchEvents = async () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    try {
      const response = await fetch(`${baseUrl}/api/all-events`);
      if (response.ok) {
        const data: EventType[] = await response.json();
        setEvents(data);
      } else {
        console.error("Failed to fetch events:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEdit = (event: EventType) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleUpdateEvent = async () => {
    if (!selectedEvent || !user) return;

    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const userToken = await user.getIdToken();
    setUpdating(true);

    try {
      const updatedEvent = {
        ...selectedEvent,
        userId: user.uid,
      };
      await axios.put(
        `${baseUrl}/api/events/${selectedEvent.id}`,
        updatedEvent,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setEvents((prev) =>
        prev.map((event) =>
          event.id === selectedEvent.id ? updatedEvent : event
        )
      );
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      setUpdating(false);
      setShowModal(false);
      setSelectedEvent(null);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!user) return;

    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const userToken = await user.getIdToken();
    setDeletingId(eventId);

    try {
      await axios.delete(`${baseUrl}/api/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <NavBar onEventCreated={fetchEvents} />
      <div className="container">
        <h2 className="mt-3">All Events</h2>
        {loading ? (
          <div className="text-center mt-3">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center mt-3">
            <p>No events found</p>
          </div>
        ) : (
          <div className="row mt-3">
            {events.map((event) => {
              const [date, time] = event.dateTime.split("T");
              const [hour, minute] = time.split(":");
              return (
                <div
                  className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3"
                  key={event.id}
                >
                  <Event
                    title={event.title}
                    date={date}
                    hour={hour}
                    minute={minute}
                    description={event.description}
                    onEdit={() => handleEdit(event)}
                    onDelete={() => handleDeleteEvent(event.id)}
                    eventUserId={event.userId}
                    deleting={deletingId === event.id}
                  />
                </div>
              );
            })}
          </div>
        )}

        {showModal && selectedEvent && (
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formEventTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedEvent.title}
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        title: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group controlId="formEventDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={selectedEvent.description}
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        description: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group controlId="formEventDateTime">
                  <Form.Label>Date and Time</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={selectedEvent.dateTime}
                    onChange={(e) =>
                      setSelectedEvent({
                        ...selectedEvent,
                        dateTime: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Form>
              {updating && (
                <div className="text-center mt-3">
                  <Spinner animation="border" variant="primary" />
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Close
              </Button>
              <Button variant="primary" onClick={handleUpdateEvent}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </>
  );
};

export default App;

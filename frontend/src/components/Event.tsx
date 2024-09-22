import React from "react";
import { useApi } from "../context/ApiContext";
import { Card, Button, Spinner } from "react-bootstrap";
interface EventProps {
  title: string;
  date: string;
  hour: string;
  minute: string;
  description?: string;
  onEdit: () => void;
  onDelete: () => void;
  eventUserId: string;
  deleting: boolean; // New prop for loading state
}

const Event: React.FC<EventProps> = ({
  title,
  date,
  hour,
  minute,
  description,
  onEdit,
  onDelete,
  eventUserId,
  deleting, // Receive loading state
}) => {
  const { user } = useApi();

  return (
    <Card
      className="text-center shadow-lg border-0 mb-4"
      style={{ width: "16rem", height: "16rem" }}
    >
      <Card.Body>
        <Card.Title className="text-primary fw-bold">{title}</Card.Title>
        <Card.Text className="text-muted">{description}</Card.Text>
        <Card.Text className="text-secondary mb-4">
          {date} at {hour}:{minute}
        </Card.Text>
        {user && user.uid === eventUserId && (
          <div className="d-flex justify-content-center">
            <Button variant="primary" onClick={onEdit} className="me-2">
              Edit
            </Button>
            <Button variant="danger" onClick={onDelete} disabled={deleting}>
              {deleting ? <Spinner size="sm" animation="border" /> : "Delete"}
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default Event;

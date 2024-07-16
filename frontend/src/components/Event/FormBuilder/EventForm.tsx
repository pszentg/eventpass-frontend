import { useState } from "react";
import styles from "./EventForm.module.css";

export type NewEvent = {
  name: string;
  start_date: string;
  end_date: string;
  location: string;
  description: string;
};

interface EventFormProps {
  createEvent: (event: NewEvent) => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ createEvent, onCancel }) => {
  const [newEvent, setNewEvent] = useState<NewEvent>({
    name: "",
    start_date: "",
    end_date: "",
    location: "",
    description: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleSubmit = () => {
    createEvent(newEvent);
    setNewEvent({
      name: "",
      start_date: "",
      end_date: "",
      location: "",
      description: "",
    });
  };

  return (
    <div className={styles.formContainer}>
      <input
        className={styles.input}
        name="name"
        value={newEvent.name}
        onChange={handleInputChange}
        placeholder="Event Name"
      />
      <input
        className={styles.input}
        type="date"
        name="start_date"
        value={newEvent.start_date}
        onChange={handleInputChange}
        placeholder="Start Date"
      />
      <input
        className={styles.input}
        type="date"
        name="end_date"
        value={newEvent.end_date}
        onChange={handleInputChange}
        placeholder="End Date"
      />
      <input
        className={styles.input}
        name="location"
        value={newEvent.location}
        onChange={handleInputChange}
        placeholder="Location"
      />
      <textarea
        className={styles.textarea}
        name="description"
        value={newEvent.description}
        onChange={handleInputChange}
        placeholder="Description"
      />
      <button className={styles.submitButton} onClick={handleSubmit}>
        Submit
      </button>
      <button className={styles.submitButton} onClick={onCancel}>
        Cancel
      </button>
    </div>
  );
};

export default EventForm;

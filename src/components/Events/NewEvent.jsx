import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { createNewEvent, queryClient } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";

// This component handles the creation of a new event.
// It displays a modal with a form and manages the mutation logic for submitting the event data.
export default function NewEvent() {
  const navigate = useNavigate(); // Hook to programmatically navigate between routes.

  // useMutation is used to handle the creation of a new event.
  // It provides methods and state for managing the mutation process.
  const { mutate, isPending, error, isError } = useMutation({
    mutationFn: createNewEvent, // Function that performs the event creation API call.
    onSuccess: () => {
      // After a successful mutation, invalidate the "events" query to refetch the updated list of events.
      // To target specific queries using invalidateQueries, provide the query key to trigger a refetch.
      queryClient.invalidateQueries({ queryKey: ["events"] });
      navigate("/events"); // Redirect the user to the events page after successful creation.
    },
    // The onSuccess callback must be a function that is executed when the mutation completes successfully.
  });
  // Mutations do not require a query key because their results are not cached.

  // This function is called when the event form is submitted.
  // It triggers the mutation with the form data.
  function handleSubmit(formData) {
    mutate({ event: formData });
  }

  return (
    // Render the modal dialog for creating a new event.
    <Modal onClose={() => navigate("../")}>
      {/* Render the event form and pass the handleSubmit function to handle form submission. */}
      <EventForm onSubmit={handleSubmit}>
        {/* Show a loading message while the mutation is pending. */}
        {isPending && "Submitting..."}
        {/* If not pending, show the Cancel link and Create button. */}
        {!isPending && (
          <>
            <Link to="../" className="button-text">
              Cancel
            </Link>
            <button type="submit" className="button">
              Create
            </button>
          </>
        )}
      </EventForm>
      {/* If there is an error during mutation, display an error block with details. */}
      {isError && (
        <ErrorBlock
          title="Failed to create event"
          message={
            error.info?.message ||
            "Failed to create event. Please check your inputs."
          }
        />
      )}
    </Modal>
  );
}

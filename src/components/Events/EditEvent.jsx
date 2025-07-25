import { Link, useNavigate, useParams } from "react-router-dom";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchEvent, updateEvent } from "../../util/http.js";
import { queryClient } from "../../util/http.js"; // Adjust path if needed
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";

// EditEvent component for editing an event
export default function EditEvent() {
  const navigate = useNavigate();
  const params = useParams();
  const eventId = params.id;

  // Fetch the event data using react-query
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["events", eventId],
    queryFn: ({ signal }) => fetchEvent({ signal, id: eventId }),
    enabled: !!eventId, // Only run if eventId exists
  });

  // Mutation for updating the event
  const {
    mutate,
    isLoading: isMutating,
    isError: isMutateError,
    error: mutateError,
  } = useMutation({
    mutationFn: updateEvent,
    // Optimistically update the cache before mutation
    onMutate: async (data) => {
      const newEvent = data.event;
      await queryClient.cancelQueries({ queryKey: ["events", eventId] });
      const previousData = queryClient.getQueryData(["events", eventId]);
      queryClient.setQueryData(["events", eventId], newEvent);
      return { previousData };
    },
    // Rollback cache if mutation fails
    onError: (_variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["events", eventId], context.previousData);
      }
    },
    // Refetch event data after mutation settles
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["events", eventId] });
    },
  });

  // Handle form submission
  function handleSubmit(formData) {
    mutate({ id: params.id, event: formData });
  }

  // Handle modal close
  function handleClose() {
    navigate("../");
  }

  let content;

  // Show loading indicator while fetching event
  if (isPending) {
    content = (
      <div className="center">
        <LoadingIndicator />
      </div>
    );
  }
  // Show error block if fetching event fails
  else if (isError) {
    content = (
      <>
        <ErrorBlock
          message={
            error && error.info && error.info.message
              ? error.info?.message
              : "Error updating Event... & Failed to load Event..."
          }
        />
        <div className="form-actions">
          <Link to="../" className="button-text">
            Cancel
          </Link>
        </div>
      </>
    );
  }
  // Show event form if data is available
  else if (data) {
    content = (
      <>
        {/* Show loading indicator while mutating */}
        {isMutating && (
          <div className="center">
            <LoadingIndicator />
          </div>
        )}
        {/* Show error block if mutation fails */}
        {isMutateError && (
          <ErrorBlock
            message={
              mutateError && mutateError.info && mutateError.info.message
                ? mutateError.info?.message
                : "Error updating Event..."
            }
          />
        )}
        {/* Event form for editing */}
        <EventForm inputData={data} onSubmit={handleSubmit}>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button" disabled={isMutating}>
            Update
          </button>
        </EventForm>
      </>
    );
  }

  // Render modal with content
  return <Modal onClose={handleClose}>{content}</Modal>;
}

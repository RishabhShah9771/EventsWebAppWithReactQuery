import {
  Link,
  useNavigate,
  useParams,
  useSubmit,
  useNavigation,
} from "react-router-dom";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import { useQuery } from "@tanstack/react-query";
import { fetchEvent } from "../../util/http.js";
// import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";

/**
 * EditEvent component allows users to edit an existing event.
 * It fetches the event data, displays a form pre-filled with the event details,
 * and handles form submission to update the event.
 */
export function EditEvent() {
// Hook to programmatically navigate between routes
  const navigate = useNavigate();
  // Hook to access route parameters (e.g., event ID from the URL)
  const params = useParams();
  // Extract the event ID from the URL parameters
  const eventId = params.id;
  // Hook to submit form data using react-router's data APIs
  const submit = useSubmit();
  // Hook to get the current navigation state (e.g., "submitting")
  const { state } = useNavigation();

  /**
   * Fetch the event data using react-query.
   * - queryKey: Unique key for caching and refetching.
   * - queryFn: Function to fetch the event data from the server.
   * - staleTime: Time in ms before data is considered stale.
   */
  const { data, isError, error } = useQuery({
    queryKey: ["events", eventId],
    queryFn: ({ signal }) => fetchEvent({ signal, id: eventId }),
    staleTime: 10000,
  });

  /**
   * (Commented out) Mutation logic for updating the event using react-query.
   * This section is not currently used, as form submission is handled via react-router's submit.
   * It demonstrates how to optimistically update the cache and handle errors.
   */
  // const {
  //   mutate,
  //   isLoading: isMutating,
  //   isError: isMutateError,
  //   error: mutateError,
  // } = useMutation({
  //   mutationFn: updateEvent,
  //   // Optimistically update the cache before mutation
  //   onMutate: async (data) => {
  //     const newEvent = data.event;
  //     await queryClient.cancelQueries({ queryKey: ["events", eventId] });
  //     const previousData = queryClient.getQueryData(["events", eventId]);
  //     queryClient.setQueryData(["events", eventId], newEvent);
  //     return { previousData };
  //   },
  //   // Rollback cache if mutation fails
  //   onError: (_variables, context) => {
  //     if (context?.previousData) {
  //       queryClient.setQueryData(["events", eventId], context.previousData);
  //     }
  //   },
  //   // Refetch event data after mutation settles
  //   onSettled: () => {
  //     queryClient.invalidateQueries({ queryKey: ["events", eventId] });
  //   },
  // });

  /**
   * Handles form submission.
   * Uses react-router's submit to send a PUT request with the updated event data.
   * @param {Object} formData - The updated event data from the form.
   */
  function handleSubmit(formData) {
    // mutate({ id: params.id, event: formData });
    // navigate("../");
    submit(formData, {
      method: "PUT",
    });
  }

  /**
   * Handles closing the modal.
   * Navigates back to the parent route (event list or details).
   */
  function handleClose() {
    navigate("../");
  }

  let content;

  // If there was an error fetching the event, show an error message and a cancel button
  if (isError) {
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
          <Link to="../" className="button">
            Cancel
          </Link>
        </div>
      </>
    );
  }
    // If event data is available, show the event form pre-filled with the data
  else if (data) {
    content = (
      <>
        {/*
        // Uncomment to show loading indicator while mutating
        {isMutating && (
          <div className="center">
            <LoadingIndicator />
          </div>
        )}
        // Uncomment to show error block if mutation fails
        {isMutateError && (
          <ErrorBlock
            message={
              mutateError && mutateError.info && mutateError.info.message
                ? mutateError.info?.message
                : "Error updating Event..."
            }
          />
        )}
        */}
        {/* EventForm displays the form for editing the event.
            - inputData: Pre-fills the form with the fetched event data.
            - onSubmit: Handles form submission.
            - Children: Shows "Updating..." while submitting, otherwise shows Cancel and Update buttons.
        */}
        <EventForm inputData={data} onSubmit={handleSubmit}>
          {state === "submitting" ? (
            <p>Updating....</p>
          ) : (
            <>
                <Link to="../" className="button-text">
                  Cancel
                </Link>
                <button type="submit" className="button">
                  Update
                </button>
            </>
          )}
        </EventForm>
      </>
    );
  }

  // Render the modal dialog with the appropriate content (error or form)
  return <Modal onClose={handleClose}>{content}</Modal>;
}

import { redirect } from "react-router-dom";
import { fetchEvent, queryClient, updateEvent } from "./http.js";

/**
 * Loader function to fetch a single event's data before rendering the edit page.
 * This ensures the form is pre-filled with the current event details.
 *
 * @param {Object} params - Parameters from the route, including the event ID.
 * @returns {Promise} - Resolves with the event data fetched from the server.
 */
export function loader({ params }) {
  return queryClient.fetchQuery({
    // Unique key for caching and identifying the event in React Query
    queryKey: ["events", params.id],
    // Function to fetch the event data, passing the abort signal and event ID
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  });
}

/**
 * Action function to handle the form submission for editing an event.
 * It updates the event on the server, invalidates the events cache,
 * and redirects the user back to the events list.
 *
 * @param {Object} request - The request object containing form data.
 * @param {Object} params - Parameters from the route, including the event ID.
 * @returns {Promise} - Resolves with a redirect response after updating.
 */
export async function action({ request, params }) {
  // Parse the submitted form data into a plain object
  const formData = await request.formData();
  const updatedEventData = Object.fromEntries(formData);

  // Send the updated event data to the server
  await updateEvent({
    id: params.id,
    event: updatedEventData,
  });

  // Invalidate the events cache so the UI reflects the latest data
  await queryClient.invalidateQueries(["events"]);

  // Redirect the user back to the parent route (events list)
  return redirect("../");
}

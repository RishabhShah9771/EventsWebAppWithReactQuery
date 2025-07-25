import { QueryClient } from "@tanstack/react-query";

// Create a single instance of QueryClient for React Query usage throughout the app
const queryClient = new QueryClient();

/**
 * Fetches a list of events from the backend.
 * Optionally filters events by a search term and/or a maximum number.
 * @param {Object} params - Parameters for fetching events.
 * @param {AbortSignal} params.signal - Signal to abort the fetch request.
 * @param {string} [params.searchTerm] - Optional search term to filter events.
 * @param {number} [params.max] - Optional maximum number of events to fetch.
 * @returns {Promise<Array>} - Resolves to an array of event objects.
 * @throws {Error} - Throws error if the fetch fails.
 */
async function fetchEvents({ signal, searchTerm, max }) {
  // Build the URL with optional query parameters
  let url = "http://localhost:3000/events";
  if (searchTerm && max) {
    url += "?search=" + searchTerm + "&max=" + max;
  } else if (searchTerm) {
    url += "?search=" + searchTerm;
  } else if (max) {
    url += "?max=" + max;
  }

  // Make the fetch request
  const response = await fetch(url, { signal: signal });

  // Handle error response
  if (!response.ok) {
    const error = new Error("An error occurred while fetching the events");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  // Parse and return the events array from the response
  const { events } = await response.json();
  return events;
}

/**
 * Creates a new event by sending event data to the backend.
 * @param {Object} eventData - Data for the new event.
 * @returns {Promise<Object>} - Resolves to the created event object.
 * @throws {Error} - Throws error if the creation fails.
 */
async function createNewEvent(eventData) {
  // Send POST request to create a new event
  const response = await fetch(`http://localhost:3000/events`, {
    method: "POST",
    body: JSON.stringify(eventData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Handle error response
  if (!response.ok) {
    const error = new Error("An error occurred while creating the event");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  // Parse and return the created event object
  const { event } = await response.json();
  return event;
}

/**
 * Fetches a list of selectable images for events from the backend.
 * @param {Object} params - Parameters for fetching images.
 * @param {AbortSignal} params.signal - Signal to abort the fetch request.
 * @returns {Promise<Array>} - Resolves to an array of image URLs.
 * @throws {Error} - Throws error if the fetch fails.
 */
async function fetchSelectableImages({ signal }) {
  // Make the fetch request for images
  const response = await fetch(`http://localhost:3000/events/images`, {
    signal,
  });

  // Handle error response
  if (!response.ok) {
    const error = new Error("An error occurred while fetching the images");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  // Parse and return the images array from the response
  const { images } = await response.json();
  return images;
}

/**
 * Fetches a single event by its ID from the backend.
 * @param {Object} params - Parameters for fetching the event.
 * @param {string} params.id - ID of the event to fetch.
 * @param {AbortSignal} params.signal - Signal to abort the fetch request.
 * @returns {Promise<Object>} - Resolves to the event object.
 * @throws {Error} - Throws error if the fetch fails.
 */
async function fetchEvent({ id, signal }) {
  // Make the fetch request for a single event by ID
  const response = await fetch(`http://localhost:3000/events/${id}`, {
    signal,
  });

  // Handle error response
  if (!response.ok) {
    const error = new Error("An error occurred while fetching the event");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  // Parse and return the event object from the response
  const { event } = await response.json();
  return event;
}

/**
 * Deletes an event by its ID from the backend.
 * @param {Object} params - Parameters for deleting the event.
 * @param {string} params.id - ID of the event to delete.
 * @returns {Promise<Object>} - Resolves to the response JSON.
 * @throws {Error} - Throws error if the deletion fails.
 */
async function deleteEvent({ id }) {
  // Send DELETE request to remove the event by ID
  const response = await fetch(`http://localhost:3000/events/${id}`, {
    method: "DELETE",
  });

  // Handle error response
  if (!response.ok) {
    const error = new Error("An error occurred while deleting the event");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  // Return the response JSON (could contain status/info)
  return response.json();
}

/**
 * Updates an existing event by its ID with new event data.
 * @param {Object} params - Parameters for updating the event.
 * @param {string} params.id - ID of the event to update.
 * @param {Object} params.event - Updated event data.
 * @returns {Promise<Object>} - Resolves to the updated event object.
 * @throws {Error} - Throws error if the update fails.
 */
async function updateEvent({ id, event }) {
  // Send PUT request to update the event by ID
  const response = await fetch(`http://localhost:3000/events/${id}`, {
    method: "PUT",
    body: JSON.stringify({ event }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Handle error response
  if (!response.ok) {
    const error = new Error("An error occurred while updating the event");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  // Return the response JSON (could contain updated event info)
  return response.json();
}

// Export all utility functions and the queryClient instance
export {
  fetchEvents,
  createNewEvent,
  fetchSelectableImages,
  fetchEvent,
  deleteEvent,
  updateEvent,
  queryClient,
};

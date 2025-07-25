import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import EventItem from "./EventItem.jsx";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../util/http.js";

// This component displays a section with the most recently added events.
// It uses React Query (TanStack Query) to fetch and manage the events data.
export default function NewEventsSection() {
  // useQuery is used to fetch events data asynchronously and manage its state.
  // queryFn is the function that returns a promise resolving to the events data.
  // queryKey is a unique identifier for this query; it must always be an array.
  // staleTime specifies how long the data is considered fresh before a refetch is triggered.
  // gcTime (commented out) would control how long the cached data is kept before being garbage collected.
  const { data, isPending, isError, error } = useQuery({
    queryFn: ({ signal, queryKey }) => fetchEvents({ signal, ...queryKey[1] }),
    queryKey: ["events", { max: 3 }],
    staleTime: 5000,
    // We can ensure that no unnecessary requests are made by setting the staleTime.
    // This is the duration after which the data will be considered stale and refetched.
    // gcTime: 30000,
    // This is the duration after which the cached data will be garbage collected,
    // meaning the cached data will be cleared after this time.
  });

  // TanStack Query will not send the HTTP request until the component is mounted.
  // The developer must write the code for the actual request and handle the response.
  // After that, the query will manage the data, errors, caching, and much more.

  let content;

  // If the query is still loading, show a loading indicator.
  if (isPending) {
    content = <LoadingIndicator />;
  }

  // If there was an error during the fetch, show an error block with a message.
  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.message || "Failed to fetch events."}
      />
    );
  }

  // If data was successfully fetched, render the list of events.
  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  // Render the section with a header and the appropriate content (loading, error, or events list).
  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}

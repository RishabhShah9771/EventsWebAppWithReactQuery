import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "../../util/http.js";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import ErrorBlock from "../UI/ErrorBlock.jsx";
import EventItem from "./EventItem.jsx";

export default function FindEventSection() {
  // useRef to access the search input DOM element directly
  const searchElement = useRef();
  // useState to store the current search term; initially undefined so no query runs
  const [searchTerm, setSearchTerm] = useState();

  // useQuery fetches events based on the search term
  // queryKey: unique identifier for the query, includes the search term for caching and refetching
  // queryFn: function to fetch events, receives the abort signal and current searchTerm
  // enabled: disables the query until a search term is set (prevents initial fetch)
  // isLoading: true only on the initial load of the query
  // isPending: true when the query is refetching after the initial load (not used here)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["events", { search: searchTerm }],
    queryFn: ({ signal }) => fetchEvents({ signal, searchTerm }),
    enabled: searchTerm !== undefined, // Only run query if searchTerm is set
  });

  // Handles form submission: prevents default, sets the search term from input
  function handleSubmit(event) {
    event.preventDefault();
    setSearchTerm(searchElement.current.value);
  }

  // Default content shown before any search is performed
  let content = <p>Please enter the search term to find specific events.</p>;

  // Show loading indicator while fetching data for the first time
  if (isLoading) {
    content = <LoadingIndicator />;
  }

  // Show error block if fetching fails
  if (isError) {
    content = (
      <ErrorBlock
        title="An error occurred"
        message={error.info?.message || "failed to fetch events."}
      />
    );
  }

  // Show list of events if data is available
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

  // Render the search form and the content (loading, error, or events)
  return (
    <section className="content-section" id="all-events-section">
      <header>
        <h2>Find your next event!</h2>
        <form onSubmit={handleSubmit} id="search-form">
          <input
            type="search"
            placeholder="Search events"
            ref={searchElement}
          />
          <button>Search</button>
        </form>
      </header>
      {content}
    </section>
  );
}

import { useIsFetching } from "@tanstack/react-query";

// Header component that displays a loading indicator and a navigation header
export default function Header({ children }) {
  // useIsFetching returns the number of active queries (fetching) in React Query
  const fetchingEventDetail = useIsFetching();

  return (
    <>
      {/* Loading indicator shown when there are active fetches */}
      <div id="main-header-loading">
        {/* Show a progress bar if any query is currently fetching */}
        {fetchingEventDetail > 0 && <progress />}
      </div>
      {/* Main header section */}
      <header id="main-header">
        <div id="header-title">
          {/* Application title */}
          <h1>React Events</h1>
        </div>
        {/* Navigation area, renders any children passed to Header */}
        <nav>{children}</nav>
      </header>
    </>
  );
}

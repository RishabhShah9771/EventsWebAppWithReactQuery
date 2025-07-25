import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import Events from "./components/Events/Events.jsx";
import EventDetails from "./components/Events/EventDetails.jsx";
import NewEvent from "./components/Events/NewEvent.jsx";
import { EditEvent } from "./components/Events/EditEvent.jsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./util/http.js";
import {
  loader as editEventLoader,
  action as editEventAction,
} from "./util/editEventLoader.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/events" />,
  },
  {
    path: "/events",
    element: <Events />,

    children: [
      {
        path: "/events/new",
        element: <NewEvent />,
      },
    ],
  },
  {
    path: "/events/:id",
    element: <EventDetails />,
    children: [
      {
        path: "/events/:id/edit",
        element: <EditEvent />,
        loader: editEventLoader,
        action: editEventAction,
      },
    ],
  },
]);

//need to create a query client to use react-query
//Query CLient is the core of the react-query lib.
//Provide is the component that will proide the query client to the app.
//It will be used in the root component of the app.

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;

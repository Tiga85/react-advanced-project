import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Root } from "./components/Root";
import { EventPage } from "./pages/EventPage";
import { EventsPage } from "./pages/EventsPage";
import { useNavigate } from "react-router-dom";

const EventPageWrapper = () => {
  const navigate = useNavigate();

  const handleEventDeleted = () => {
    navigate("/");
  };

  return <EventPage onEventDeleted={handleEventDeleted} />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <EventsPage />,
        // loader: postListLoader,
      },
      {
        path: "event/:eventId",
        element: <EventPageWrapper />,
        // loader: postLoader,
        // action: addComment,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);

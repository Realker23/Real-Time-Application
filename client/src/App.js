import React from "react";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Join from "./components/Join/Join";
import Chat from "./components/Chat/Chat";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Join />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
]);

const App = () => {
  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
};

export default App;

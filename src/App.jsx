import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Landing from "./pages/Landing.jsx";
import Link from "./pages/Link.jsx";
import RedirectLink from "./pages/RedirectLink.jsx";
import AppLayout from "./layouts/AppLayout.jsx";
import Auth from "./pages/Auth.jsx";
import UrlProvider from "./Context/context.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import React from "react";
import NotFound from "./components/NotFound.jsx";

const router = createBrowserRouter(
  [
    {
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <Landing />,
        },
        {
          path: "/dashboard",
          element: (
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          ),
        },
        {
          path: "/link/:id",
          element: (
            <RequireAuth>
              <Link />
            </RequireAuth>
          ),
        },
        {
          path: "/auth",
          element: <Auth />,
        },
        {
          path: "/:id",
          element: <RedirectLink />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ],
  {
    basename: "/",
  }
);

function App() {
  return (
    <UrlProvider>
      <RouterProvider router={router} />
    </UrlProvider>
  );
}

export default App;

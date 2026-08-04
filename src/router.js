import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import App from "./App";
import ClientList from "./pages/client/ClientList";
import ClientDetail from "./pages/client/ClientDetail";
import ClientAdd from "./pages/client/ClientAdd";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "home",
        Component: Home,
      },
      {
        path: "clients",
        Component: ClientList,
      },
      {
        path: "clients/:id",
        Component: ClientDetail,
      },
      {
        path: "clients/add",
        Component: ClientAdd,
      },
    ],
  },
]);

export default router;

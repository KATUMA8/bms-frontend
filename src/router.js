import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import App from "./App";
import ClientList from "./pages/client/ClientList";
import ClientDetail from "./pages/client/ClientDetail";
import ClientRegister from "./pages/client/ClientRegister";
import ClientEdit from "./pages/client/clientEdit";

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
        Component: ClientRegister
      },
      {
        path: "clients/edit/:id",
        Component: ClientEdit
      }
    ],
  },
]);

export default router;

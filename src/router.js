import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import App from "./App";
import ClientList from "./pages/client/ClientList";
import ClientDetail from "./pages/client/ClientDetail";
import ClientRegister from "./pages/client/ClientRegister";
import ClientEdit from "./pages/client/ClientEdit";
import ClientDocuments from "./pages/client/clientDocument";

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
        path: "clients/add",
        Component: ClientRegister
      },
      {
        path: "clients/:id",
        Component: ClientDetail,
      },
      {
        path: "clients/edit/:id",
        Component: ClientEdit
      },
      {
        path: "/clients/:id/documents",
        Component: ClientDocuments
      }
    ],
  },
]);

export default router;

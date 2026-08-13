import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import App from "./App";
import ClientList from "./pages/client/ClientList";
import ClientDetail from "./pages/client/ClientDetail";
import ClientRegister from "./pages/client/ClientRegister";
import ClientEdit from "./pages/client/ClientEdit";
import ClientDocuments from "./pages/client/clientDocument";
import ProjectList from "./pages/project/ProjectList";
import ProjectDetail from "./pages/project/ProjectDetail";
import QuoteEdit from "./pages/quote/QuoteEdit";
import ProjectRegister from "./pages/project/ProjectRegister";
import ProjectEdit from "./pages/project/ProjectEdit";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      // --- ホーム ---
      {
        index: true,
        Component: Home,
      },
      // --- 顧客管理 ---
      {
        path: "clients",
        Component: ClientList,
      },
      {
        path: "clients/add",
        Component: ClientRegister,
      },
      {
        path: "clients/:id",
        Component: ClientDetail,
      },
      {
        path: "clients/edit/:id",
        Component: ClientEdit,
      },
      {
        path: "clients/:id/documents",
        Component: ClientDocuments,
      },
      // --- 案件管理 ---
      {
        path: "projects",
        Component: ProjectList,
      },
      {
        path: "projects/add", // ★ :id よりも上に配置する
        Component: ProjectRegister,
      },
      {
        path: "projects/edit/:id",
        Component: ProjectEdit,
      },

      {
        path: "projects/:id",
        Component: ProjectDetail,
      },
      {
        path: "projects/:pid/quotes/edit/:id",
        Component: QuoteEdit,
      },
      // --- 業者管理 ---
    ],
  },
]);

export default router;

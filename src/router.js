
import { createBrowserRouter } from 'react-router';
import Home from './pages/Home';
import App from './App';
import ClientList from './pages/client/ClientList';

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
        Component: ClientList
      }
    ],
  },
]);

export default router;

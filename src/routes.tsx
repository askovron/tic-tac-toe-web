import { createBrowserRouter } from "react-router-dom";
import { PageLogin } from "./pages/pageLogin";
import { PageHome } from "./pages/pageHome";
import { PageGame } from "./pages/pageGame";
import { PageHistory } from "./pages/pageHistory";
import { PageResult } from "./pages/pageResult";

export const routes = createBrowserRouter([
  {
    path: "/login",
    Component: PageLogin,
  },
  {
    path: "/game",
    Component: PageGame,
  },
  {
    path: "/result/:result",
    Component: PageResult,
  },
  {
    path: "/history",
    Component: PageHistory,
  },
  {
    path: "",
    Component: PageHome,
  },
]);

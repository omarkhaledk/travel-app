import { createBrowserRouter } from "react-router-dom";
import App from './App';
import SearchResult from "./pages/SearchResult";

const paths = [
    { path: "/", element: <App /> },
    { path: "/search-result", element: <SearchResult /> },
]

const router = createBrowserRouter(paths);

export default router;
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Movies } from "../../features/movies";
import { Layout } from "./Layout";

export const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="movies" element={<Movies />} />
          <Route path="*" element={<Navigate to="/movies" />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};
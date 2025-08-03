import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { NavPanel } from "./NavPanel";

export const App = () => {
  return (
    <HashRouter>
      <NavPanel />
      <Routes>
        {/* <Route path="*" element={<Navigate to={listRoutes.movies} />} /> */}
      </Routes>
    </HashRouter>

  );
};
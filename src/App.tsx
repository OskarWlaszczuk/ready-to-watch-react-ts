import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

export const App = () => {
  return (
    <HashRouter>
      {/* <NavigationPanel /> */}
      <Routes>
        {/* <Route path="*" element={<Navigate to={listRoutes.movies} />} /> */}
      </Routes>
    </HashRouter>
  );
};
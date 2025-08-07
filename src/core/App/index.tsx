import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { Explore } from "../../features/MediaTabs";
import { Preferences } from "../../features/preferences/Preferences";

export const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="explore/" replace />} />
          <Route path="explore/" element={<Explore />} />
          <Route path="preferences/" element={<Preferences />} />
          <Route path="*" element={<Navigate to="explore/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { Home } from "../../features/home";
import { Preferences } from "../../features/preferences/Preferences";
import { Login } from "../../features/auth/Login";
import { Register } from "../../features/auth/Register";

export const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Route>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </HashRouter>
  );
};
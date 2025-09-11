import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./Layout";
import { Home } from "../../features/home";
import { Preferences } from "../../features/preferences/Preferences";
import { Login } from "../../features/auth/Login";
import { Register } from "../../features/auth/Register";
import { useLayoutEffect } from "react";
import { secureUserApi } from "../../common/constants/api";
import { useAccessToken } from "../../common/hooks/useAccessToken";

export const App = () => {
  const { accessToken, refetchAccessToken } = useAccessToken();

  useLayoutEffect(() => {
    secureUserApi.interceptors.request.use((config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      return config;
    });

    secureUserApi.interceptors.response.use(
      response => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          (error.status === 403 || error.status === 401) && !originalRequest._retry
        ) {
          originalRequest._retry = true;
          await refetchAccessToken();
        }

        return Promise.reject(error);
      }
    );
  }, [accessToken, refetchAccessToken]);

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
import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { TabConfig } from "../../common/components/TabsPanel"
import { Movies } from "../lists/Movies"
import axios from "axios";
import { authApiPublic, authApiSecure, userApi } from "../../common/constants/api";
import { response } from "express";

export const AuthContext = createContext(null);
//@ts-ignore
export const AuthProvider = ({ children }) => {
    const [accessToken, setAccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const isSessionStart = !isInitialized && !accessToken;
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const refreshResponse = await authApiSecure.post("/refresh");
                const newToken = refreshResponse.data.accessToken;
                setAccessToken(newToken);
            } catch (err) {
                setAccessToken(null);
            } finally {
                setIsInitialized(true);
            }
        };

        if (isSessionStart) {
            initializeAuth();
        }
    }, [isSessionStart]);


    useEffect(() => {
        const userInterceptor = userApi.interceptors.request.use((config) => {
            console.log("konfiguracja requestu", config);
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            // config.headers.Authorization = (
            //     //@ts-ignore
            //     accessToken ?
            //         `Bearer ${accessToken}` :
            //         config.headers.Authorization
            // );

            return config;
        });

        return () => {
            userApi.interceptors.request.eject(userInterceptor);
        };
    }, [accessToken]);

    useEffect(() => {
        const userInterceptor = userApi.interceptors.response.use(
            response => response,
            async (error) => {
                const originalRequest = error.config;

                if (
                    (error.status === 403 || error.status === 401) && !originalRequest._retry
                ) {
                    originalRequest._retry = true;
                    try {
                        const response = await authApiSecure.post("/refresh");
                        const newAccessToken = response.data.accessToken;

                        setAccessToken(newAccessToken);

                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                        return userApi(originalRequest);
                    } catch (error) {
                        //@ts-ignore
                        setAccessToken(null);
                    } finally {
                        setIsInitialized(true); // zawsze oznaczamy, że próbowaliśmy
                    }
                }

                //po co tutaj odrzucać obietnicę?
                //Czy to dlatego, że funkcje async zawsze muszą zwracać obietnice?
                //Co się stanie po zwróceniu przez tę funkcję niespełnionej obietnicy?
                return Promise.reject(error);
            }
        );

        return () => {
            userApi.interceptors.response.eject(userInterceptor);
        };
    }, [isInitialized]);

    useEffect(() => {
        if (!accessToken) return;

        const getUser = async () => {
            try {
                console.log("fetching user...", accessToken);

                const result = await userApi.get("/");
                setUser(result.data.user);
                console.log("user fetched");
            } catch (err) {
                //@ts-ignore
                setAccessToken(null);
                console.log("error in: getUser function", err)
            }
        };

        getUser();
    }, [accessToken]);

    return (
        //@ts-ignore
        <AuthContext.Provider value={{ accessToken, setAccessToken, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const Home = () => {
    //@ts-ignore
    const { user, accessToken } = useContext(AuthContext);

    console.log(user, accessToken)
    return (
        <>
            Welcome {!!user && (
                user?.nickname
            )}
        </>
    );
};
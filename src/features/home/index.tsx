import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react";
import { authApiSecure, userApi } from "../../common/constants/api";
import { useQuery } from "@tanstack/react-query";
import { useAccessToken } from "../../common/hooks/useAccessToken";
import { useUserSecure } from "../../common/hooks/useUserSecure";
export const AuthContext = createContext(null);

//@ts-ignore
const useUserInterceptors = (accessToken, refetchAccessToken) => {
    useLayoutEffect(() => {
        const userInterceptor = userApi.interceptors.request.use((config) => {
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }

            return config;
        });

        return () => {
            userApi.interceptors.request.eject(userInterceptor);
        };
    }, [accessToken]);

    const userInterceptor = userApi.interceptors.response.use(
        response => response,
        async (error) => {
            const originalRequest = error.config;

            if (
                (error.status === 403 || error.status === 401) && !originalRequest._retry
            ) {
                originalRequest._retry = true;
                await refetchAccessToken();
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
};



//@ts-ignore
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const {
        status,
        accessToken,
        isPaused,
        error,
        refetchAccessToken
    } = useAccessToken();
    // useInitializeAuth(accessToken, setAccessToken);
    useUserInterceptors(accessToken, refetchAccessToken);

    return (
        //@ts-ignore
        <AuthContext.Provider value={{ accessToken, user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};



export const Home = () => {
    const { accessToken } = useAccessToken();

    const {
        user,
        status,
        isPaused,
        error,
    } = useUserSecure(accessToken);

    return (
        <>
            {
                !accessToken ?
                    "Sesja wygasła" :
                    <>
                        Welcome {!!user && (
                            //@ts-ignore
                            user?.nickname
                        )}
                    </>
            }
        </>
    );
};
import { useQuery } from "@tanstack/react-query";
import { userApi } from "../constants/api";

export const useUserSecure = (accessToken:string) => {
    const getUser = async (): Promise<string> => {
        const response = await userApi.get("/");
        return response.data.user;
    };

    const userFreshTimeMin = 60 * 60 * 1000;

    const { data: user, status, isPaused, error } = useQuery({
        queryKey: ['user'],
        queryFn: getUser,
        staleTime: userFreshTimeMin,
        //@ts-ignore
        cacheTime: userFreshTimeMin,
        enabled: !!accessToken,
    });

    return {
        user,
        status,
        isPaused,
        error,
    };
};
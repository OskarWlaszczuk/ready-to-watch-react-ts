import { useQuery } from "@tanstack/react-query";
import { authApiSecure } from "../constants/api";

export const useAccessToken = () => {
    const refreshTimeMin = 15 * 60 * 1000;

    const refreshAccessToken = async (): Promise<string> => {
        const response = await authApiSecure.get("/refresh");
        return response.data.accessToken;
    };

    const { data: accessToken, status, isPaused, error, refetch: refetchAccessToken } = useQuery<string>({
        queryKey: ['accessToken'],
        queryFn: refreshAccessToken,
        staleTime: refreshTimeMin,
        //@ts-ignore
        cacheTime: refreshTimeMin,
    });

    return {
        status,
        accessToken,
        isPaused,
        error,
        refetchAccessToken
    };
};
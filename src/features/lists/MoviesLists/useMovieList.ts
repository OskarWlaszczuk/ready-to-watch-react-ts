import { useQuery } from "@tanstack/react-query";
import { MovieListResponse } from "../../../common/types/TmdbTypes/mediaListResponse.types";
import { fetchApi } from "../../../common/functions/fetchApi";


interface ListQueryParams {
    page: string;
}

interface UseMediaListProps {
    listType: string | undefined;
    queryParams: ListQueryParams;
    mediaType: "movie"
}

export const useMediaList = ({ mediaType, listType, queryParams }: UseMediaListProps) => {
    const queryString = new URLSearchParams({
        ...queryParams,
    }).toString();

    const {
        status,
        data,
        isPaused
    } = useQuery<MovieListResponse>({
        queryKey: [`${mediaType} ${listType} list`, queryParams, mediaType, listType],
        queryFn: () => fetchApi(`${mediaType}/${listType}?${queryString}`),
        enabled: !!listType,
    });

    return {
        status,
        data,
        isPaused
    };
};

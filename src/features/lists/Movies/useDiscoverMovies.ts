import { useQuery } from "@tanstack/react-query";
import { DecadeEndpointQueryParam } from "../../../common/hooks/useDecadeFilterConfig";
import { GenresEndpointQueryParam } from "../../../common/hooks/useGenresFilterConfig";
import { MovieListResponse } from "../../../common/types/TmdbTypes/mediaListResponse.types";
import { fetchApi } from "../../../common/functions/fetchApi";

export interface MovieEndpointQueryParams extends GenresEndpointQueryParam, DecadeEndpointQueryParam {
    with_companies?: string
    with_origin_country?: string;
    with_original_language?: string
}

interface UseDiscoverMoviesProps {
    endpointQueryParams: MovieEndpointQueryParams;
}

export const useDiscoverMovies = ({ endpointQueryParams }: UseDiscoverMoviesProps) => {
    const queryParamsString = new URLSearchParams({
        ...endpointQueryParams,
    }).toString();

    const { status, data, isPaused } = useQuery<MovieListResponse>({
        queryKey: ["discover movies", endpointQueryParams],
        queryFn: () => fetchApi(`discover/movie?${queryParamsString}`),
    });

    return {
        status,
        data,
        isPaused
    };
};
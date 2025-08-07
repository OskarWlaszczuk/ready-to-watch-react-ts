import { useSearchParams } from "react-router-dom";
import { useGenresQuery } from "./useGenresQuery";
import { formatToQueryValue } from "../functions/formatToQueryParam";
import { FilterConfig } from "../types/FilterConfig";
import { ListOptionType } from "../types/ListOptionType";


export interface GenresEndpointQueryParam {
    with_genres?: string;
}

export const useGenresFilterConfig = () => {
    const { genres } = useGenresQuery();
    const [searchParams] = useSearchParams();

    const genreQueryKey = "genre";
    const genreQueryValues = searchParams.getAll(genreQueryKey);

    const genreOptions: ListOptionType[] = genres?.map(({ name }) => ({ label: name, queryValue: formatToQueryValue(name) })) || [];
    
    const selectedGenreIds = (
        genres
            ?.filter(({ name }) => genreQueryValues.includes(formatToQueryValue(name)))
            .map(({ id }) => id)
    ) || [];

    const endpointGenreQueryParam: GenresEndpointQueryParam = {
        with_genres: selectedGenreIds?.join(","),
    };

    const genreFilterConfig: FilterConfig = {
        label: "Genres",
        options: genreOptions,
        displayType: "multiSelect",
        queryKey: genreQueryKey,
        endpointQueryParam: endpointGenreQueryParam,
    };

    return genreFilterConfig
};
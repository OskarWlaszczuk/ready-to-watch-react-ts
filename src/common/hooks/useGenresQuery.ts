import { useQuery } from "@tanstack/react-query";
import { GenreItem } from "../types/TmdbTypes/GenreItem";
import { fetchApi } from "../functions/fetchApi";

interface TmdbGenresResponse {
    genres: GenreItem[];
}

export const useGenresQuery = () => {
    const {
        status,
        data,
        isPaused
    } = useQuery<TmdbGenresResponse>({
        queryKey: ["movie genres"],
        queryFn: () => fetchApi("'/movieGenres.json'"),
    });

    const genres = data?.genres;

    return { status, genres, isPaused };
};
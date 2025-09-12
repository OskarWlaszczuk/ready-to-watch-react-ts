import { MultiSelectList } from '../../../common/components/MultiSelectList';
import { formatToQueryValue } from '../../../common/functions/formatToQueryParam';
import { useGenresQuery } from '../../../common/hooks/useGenresQuery';
import { useUpdateQueryParams } from '../../../common/components/MultiSelectList/useUpdateQueryParams';
import { useState } from 'react';
import { useAccessToken } from '../../../common/hooks/useAccessToken';
import { useUserSecure } from '../../../common/hooks/useUserSecure';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { secureUserApi } from '../../../common/constants/api';

// interface WatchProvider {
//     display_priority: number;
//     logo_path: string;
//     provider_id: number;
//     provider_name: string;
// }

// interface ProvidersResponse {
//     results: WatchProvider[];
// }

// export const useMovieProviders = (region: string = 'PL', language: string = 'pl-PL') => {
//     const { data } = useQuery<ProvidersResponse>({
//         queryKey: ['movieProviders', region, language],
//         queryFn: () => fetchApi("watch/providers/movie"),
//         staleTime: 1000 * 60 * 60, // 1 godzina
//         retry: 1,
//     });

//     return data;
// };

export const Preferences = () => {
    const { genres: movieGenres } = useGenresQuery();
    const { accessToken } = useAccessToken();

    const {
        user: prefferedGenres,
        status: userGenresStatus,
        isPaused,
        error,
        refetch
        //@ts-ignore
    } = useUserSecure({ accessToken, resource: "prefferences/genres" });
    const queryClient = useQueryClient();

    const { status: postStatus, error: errorStatus, mutate: likeGenre } = useMutation({
        mutationFn: async (tmdb_genre_id) => {
            const response = await secureUserApi.post(
                "prefferences/genres",
                { tmdb_genre_id },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );
            return response.data;
        },
        onSuccess: () => {
            console.log("✅ Genre added successfully");
            refetch()
            // queryClient.setQueryData(["prefferences/genres", tmdb_genre_id], tmdb_genre_id)
        },
        onError: (error) => {
            console.error("❌ Failed to add genre", error);
        }
    });

    //@ts-ignore
    // const activeGenres = userGenres?.filter(({ tmdb_genre_id }) => genres?.map(({ id }) => id).includes(tmdb_genre_id));
    console.log(prefferedGenres);
    console.log(postStatus);
    if (!movieGenres) return <></>;

    const isGenreActive = (genre: string) => {
        const genreId = movieGenres.find(({ name }) => name === genre)?.id!;
        //@ts-ignore
        return prefferedGenres.includes(genreId);
    }
    const genreListTitle = "Genres";
    const genreOptions = movieGenres.map(({ name }) => name);
    const addNewGenre = (genre: string) => {
        const genreId = movieGenres.find(({ name }) => name === genre)?.id!;
        //@ts-ignore
        likeGenre(genreId);
    };

    if (userGenresStatus === "pending") return <>Loadding...</>

    return (
        <>
            <MultiSelectList
                onOptionChange={addNewGenre}
                isOptionActive={isGenreActive}
                title={genreListTitle}
                options={genreOptions}
            />
        </>
    );
};
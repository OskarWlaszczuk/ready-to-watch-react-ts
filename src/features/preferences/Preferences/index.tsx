import { MultiSelectList } from '../../../common/components/MultiSelectList';
import { formatToQueryValue } from '../../../common/functions/formatToQueryParam';
import { useGenresQuery } from '../../../common/hooks/useGenresQuery';
import { useUpdateQueryParams } from '../../../common/components/MultiSelectList/useUpdateQueryParams';
import { useState } from 'react';
import { useAccessToken } from '../../../common/hooks/useAccessToken';
import { useUserSecure } from '../../../common/hooks/useUserSecure';

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
    const { genres } = useGenresQuery();
    const { accessToken } = useAccessToken();

    const genreQueryKey = "genre";
    const { currentListParams, updateQueryParams } = useUpdateQueryParams(genreQueryKey);
    const {
        user: userGenres,
        status,
        isPaused,
        error,
        //@ts-ignore
    } = useUserSecure({ accessToken, resource: "prefferences/genres" });

    //@ts-ignore
    // const activeGenres = userGenres?.filter(({ tmdb_genre_id }) => genres?.map(({ id }) => id).includes(tmdb_genre_id));
    console.log(userGenres);

    if (!genres) return <></>;

    const isGenreActive = (genre: string) => {
        const genreId = genres.find(({ name }) => name === genre)?.id!;
        //@ts-ignore
        return userGenres.includes(genreId);
    }
    const genreListTitle = "Genres";
    const genreOptions = genres.map(({ name }) => name);

    return (
        <>
            <MultiSelectList
                onOptionChange={updateQueryParams}
                isOptionActive={isGenreActive}
                title={genreListTitle}
                options={genreOptions}
            />
        </>
    );
};
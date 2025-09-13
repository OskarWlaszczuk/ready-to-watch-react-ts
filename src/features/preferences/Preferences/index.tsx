import { MultiSelectList } from '../../../common/components/MultiSelectList';
import { formatToQueryValue } from '../../../common/functions/formatToQueryParam';
import { useGenresQuery } from '../../../common/hooks/useGenresQuery';
import { useUpdateQueryParams } from '../../../common/components/MultiSelectList/useUpdateQueryParams';
import { useState } from 'react';
import { useAccessToken } from '../../../common/hooks/useAccessToken';
import { useUserSecure } from '../../../common/hooks/useUserSecure';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { secureUserApi } from '../../../common/constants/api';

const useLikeGenreMutation = () => {
    const { accessToken } = useAccessToken();
    const queryClient = useQueryClient();

    const { status: likeGenreStatus, error: likeGenreError, mutate: likeGenre } = useMutation({
        mutationFn: async (genreId: number) => {
            const response = await secureUserApi.post(
                "prefferences/genres",
                { genreId },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );
            return response.data;
        },
        onSuccess: ({ genreId }) => {
            console.log("✅ Genre added successfully");
            console.log(genreId);
            queryClient.setQueryData(["secureUser", "prefferences/genres"], ((likedGenres: any) => [
                ...likedGenres,
                genreId
            ]));


        },
        onError: (error) => {
            console.error("❌ Failed to add genre", error);
        }
    });

    return { likeGenre, likeGenreError, likeGenreStatus };
};

const useDislikeGenreMutation = () => {
    const { accessToken } = useAccessToken();
    const queryClient = useQueryClient();

    const { status: likeGenreStatus, error: likeGenreError, mutate: dislikeGenre } = useMutation({
        mutationFn: async (genreId: number) => {
            const response = await secureUserApi.delete(`prefferences/genres/${genreId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            return response.data;
        },
        onSuccess: ({ genreId }) => {
            console.log(" Genre removed");
            console.log(genreId);
            queryClient.setQueryData(["secureUser", "prefferences/genres"], ((likedGenres: any) => {
                const updatedGenres = likedGenres.filter(id => id !== Number(genreId));
                return updatedGenres;
            }));
        },
        onError: (error) => {
            console.error("❌ Failed to remove genre", error);
        }
    });

    return { dislikeGenre, likeGenreError, likeGenreStatus };
};


export const Preferences = () => {
    const { genres: movieGenres } = useGenresQuery();
    const { accessToken } = useAccessToken();

    const {
        user: likedGenres,
        status: likedGenresStatus,
        isPaused,
        error,
        refetch
        //@ts-ignore
    } = useUserSecure({ accessToken, resource: "prefferences/genres" });
    console.log(likedGenres);
    const {
        likeGenre,
        likeGenreError,
        likeGenreStatus,
    } = useLikeGenreMutation();

    const {
        dislikeGenre
    } = useDislikeGenreMutation();
    if (!movieGenres) return <></>;

    const isGenreLiked = (genre: string) => {
        const genreId = movieGenres.find(({ name }) => name === genre)?.id!;
        //@ts-ignore
        return likedGenres.includes(genreId);
    };

    const genreListTitle = "Genres";
    const genreOptions = movieGenres.map(({ name }) => name);

    const onGenreClick = (genre: string) => {
        const genreId = movieGenres.find(({ name }) => name === genre)?.id!;

        isGenreLiked(genre) ?
            dislikeGenre(genreId) :
            likeGenre(genreId)
    };

    if (likedGenresStatus === "pending") return <>Loadding...</>

    return (
        <>
            <MultiSelectList
                onOptionChange={onGenreClick}
                isOptionActive={isGenreLiked}
                title={genreListTitle}
                options={genreOptions}
            />
        </>
    );
};
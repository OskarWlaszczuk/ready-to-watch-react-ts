import { MultiSelectList } from '../../../common/components/MultiSelectList';
import { useGenresQuery } from '../../../common/hooks/useGenresQuery';
import { useAccessToken } from '../../../common/hooks/useAccessToken';
import { useUserSecure } from '../../../common/hooks/useUserSecure';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { secureUserApi } from '../../../common/constants/api';
import SearchTmdbPanel, { SimplefiedEntity } from '../../../common/components/SearchTmdb';
import { ListOption, ListOptions } from '../../../common/components/MultiSelectList/styled';
import { PersonListItem } from '../../../common/types/TmdbTypes/mediaListItem.types';

type EntityApiResource = "collections" | "genres" | "people";

const useDislikeEntity = (entityApiResource: EntityApiResource) => {
    const { accessToken } = useAccessToken();
    const queryClient = useQueryClient();
    const likedEntityApiPath = `liked/${entityApiResource}`;

    const onDislikePrefferenceSuccess = ({ data }) => {
        const dislikedEntityId = data.tmdb_id;
        queryClient.setQueryData(["secureUser", likedEntityApiPath], ((likedEntites: any) => {
            //@ts-ignore                
            console.log();

            console.log(likedEntites, dislikedEntityId);

            const updatedPrefferences = likedEntites.filter(({ tmdb_id }) => tmdb_id !== Number(dislikedEntityId));
            return updatedPrefferences;
        }));

        console.log(`${entityApiResource} ${dislikedEntityId} removed`);
    };

    const {
        status: dislikeEntityErrorStatus,
        error: dislikeEntityError,
        mutate: dislikeEntity
    } = useMutation({
        //@ts-ignore
        mutationFn: async ({ id }) => {
            try {
                console.log(`Disliking ${entityApiResource}..`);
                const response = await secureUserApi.delete(`${likedEntityApiPath}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                return response.data;
            } catch (error) {
                console.log("Error in dislike mutation:", error);
            }
        },
        onSuccess: onDislikePrefferenceSuccess,
        onError: (error) => {
            console.error(`❌Failed to remove ${entityApiResource}`, error);
        }
    });

    return {
        dislikeEntityErrorStatus,
        dislikeEntityError,
        dislikeEntity
    };
};

const useLikeEntity = (entityApiResource: EntityApiResource) => {
    const { accessToken } = useAccessToken();
    const queryClient = useQueryClient();

    const likedEntityApiPath = `liked/${entityApiResource}`;

    const onLikeSuccess = ({ data }) => {
        const likedEntity = data;

        console.log(`✅ ${entityApiResource} added successfully`, likedEntity);

        queryClient.setQueryData(["secureUser", likedEntityApiPath], ((likedEntities: any) => {
            console.log(likedEntities);

            return [
                ...likedEntities,
                likedEntity
            ]
        }));
    };

    const onLikeError = (error) => {
        console.error("❌ Failed to add entity", error);
    };

    const { status: likeEntityStutus, error: likeEntityError, mutate: likeEntity } = useMutation({
        //@ts-ignore
        mutationFn: async ({ id, name }) => {
            const response = await secureUserApi.post(
                likedEntityApiPath,
                { id, name },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                }
            );
            return response.data;
        },
        onSuccess: onLikeSuccess,
        onError: onLikeError
    });

    return {
        likeEntity,
        likeEntityStutus,
        likeEntityError
    };
};

export const LikedGenres = () => {
    const { genres: movieGenres } = useGenresQuery();
    const { accessToken } = useAccessToken();
    //@ts-ignore
    const { user: likedGenres } = useUserSecure({ accessToken, resource: "liked/genres" });
    const entity: EntityApiResource = "genres";

    const { likeEntity: likeGenre, likeEntityError, likeEntityStutus } = useLikeEntity(entity)
    const { dislikeEntity: dislikeGenre, dislikeEntityError, dislikeEntityErrorStatus } = useDislikeEntity(entity)

    if (!movieGenres) return <></>;

    const isGenreLiked = (genre: string) => {
        const genreId = movieGenres.find(({ name }) => name === genre)?.id!;
        //@ts-ignore
        return likedGenres.some(({ tmdb_id }) => tmdb_id === genreId);
    };

    const onGenreClick = (clickedGenre: string) => {
        const genre = movieGenres.find(({ name }) => name === clickedGenre)!;

        isGenreLiked(clickedGenre) ?
            //@ts-ignore
            dislikeGenre({ id: genre.id }) :
            //@ts-ignore
            likeGenre(genre)
    };

    const genreListTitle = "Genres";
    const genreOptions = movieGenres.map(({ name }) => name);

    return (
        <>
            <MultiSelectList
                title={genreListTitle}
                options={genreOptions}
                isOptionActive={isGenreLiked}
                onOptionChange={onGenreClick}
            />
        </>
    );
};

export const LikedCollections = () => {
    const { accessToken } = useAccessToken();
    const entity: EntityApiResource = "collections";

    const { likeEntity: likeCollection, likeEntityError, likeEntityStutus } = useLikeEntity(entity)
    const { dislikeEntity: dislikeCollection, dislikeEntityError, dislikeEntityErrorStatus } = useDislikeEntity(entity)

    //@ts-ignore
    const { user: likedCollections } = useUserSecure({ accessToken, resource: "liked/collections" });

    if (!likedCollections) return <></>;

    const isCollectionLiked = (collectionName: string) => {
        //@ts-ignore
        return likedCollections.some(({ name }) => name === collectionName);
    };

    const onCollectionClick = (simplefiedCollection: SimplefiedEntity) => {
        console.log(`Selected collection: ${simplefiedCollection.name}`);

        isCollectionLiked(simplefiedCollection.name) ?
            //@ts-ignore
            dislikeCollection({ id: simplefiedCollection.id }) :
            //@ts-ignore
            likeCollection(simplefiedCollection)
    };

    return (
        <>
            <div style={{ backgroundColor: "teal" }}>
                <SearchTmdbPanel
                    searchKey="collection"
                    getResultItemProps={(collection) => ({
                        onClickHandler: onCollectionClick,
                        id: collection.id,
                        name: collection.name,
                        extraContent: <></>,
                        image: collection.poster_path,
                    })}
                />
                <ListOptions>
                    {
                        likedCollections.map(({ name, tmdb_id }) => (
                            <ListOption
                                $activeOption={isCollectionLiked(name)}
                                key={name}
                                //@ts-ignore
                                onClick={() => dislikeCollection({ id: tmdb_id })}
                            >{name}
                            </ListOption>
                        ))
                    }
                </ListOptions>
            </div>
        </>
    );
};

export const LikedPeople = () => {
    const { accessToken } = useAccessToken();
    const entity: EntityApiResource = "people";

    const { likeEntity: likePerson, likeEntityError, likeEntityStutus } = useLikeEntity(entity)
    const { dislikeEntity: dislikePerson, dislikeEntityError, dislikeEntityErrorStatus } = useDislikeEntity(entity)

    //@ts-ignore
    const { user: likedPeople } = useUserSecure({ accessToken, resource: `liked/${entity}` });

    if (!likedPeople) return <></>;

    const isPersonLiked = (collectionName: string) => {
        //@ts-ignore
        return likedPeople.some(({ name }) => name === collectionName);
    };

    const onPersonClick = (simplefiedPerson: SimplefiedEntity) => {
        console.log(`Selected collection: ${simplefiedPerson.name}`);

        isPersonLiked(simplefiedPerson.name) ?
            //@ts-ignore
            dislikePerson({ id: simplefiedPerson.id }) :
            //@ts-ignore
            likePerson(simplefiedPerson)
    };

    return (
        <>
            <div style={{ backgroundColor: "teal" }}>
                <SearchTmdbPanel
                    searchKey="person"
                    getResultItemProps={(person:PersonListItem) => ({
                        onClickHandler: onPersonClick,
                        id: person.id,
                        name: person.name,
                        extraContent: <></>,
                        image: person.profile_path,
                    })}
                />
                <ListOptions>
                    {
                        likedPeople.map(({ name, tmdb_id }) => (
                            <ListOption
                                $activeOption={isPersonLiked(name)}
                                key={name}
                                //@ts-ignore
                                onClick={() => dislikePerson({ id: tmdb_id })}
                            >{name}
                            </ListOption>
                        ))
                    }
                </ListOptions>
            </div>
        </>
    );
};


export const Preferences = () => {
    return (
        <>
            <LikedGenres />
            <LikedCollections />
            <LikedPeople />
        </>
    );
};
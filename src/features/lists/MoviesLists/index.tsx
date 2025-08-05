import { useSearchParams } from "react-router-dom";
import { DropdownList, DropdownListProps } from "../../../common/components/DropdownList";
import { TabConfig, TabsPanel } from "../../../common/components/TabsPanel";
import { FilterOption } from "../../../common/types/FilterOption";
import {  ListTitle } from "./styled"
import { useMediaList } from "./useMovieList";
import { MediaGrid } from "../../../common/components/MediaGrid";
import { MovieListItem } from "../../../common/types/TmdbTypes/mediaListItem.types";
import { MediaListResponse, MovieListResponse } from "../../../common/types/TmdbTypes/mediaListResponse.types";

const getDecadeOptions = () => {
    const decades = [
        "2020s", "2010s", "2000s", "1990s", "1980s", "1970s",
        "1960s", "1950s", "1940s", "1930s", "1920s", "1910s",
        "1900s", "1890s", "1880s", "1870s"
    ];

    const decadeOptions: FilterOption[] = [
        ...decades.map(decade => ({ queryValue: decade, label: decade }))
    ];

    return decadeOptions;
};

interface MediaListSectionProps {
    filtersConfig: DropdownListProps[];
    movieListResponse: MovieListResponse;
}

const extractMovieProps = (movie: MovieListItem) => ({
    imagePath: movie.poster_path,
    name: movie.title,
    detailsRoute: `/movie/${movie.id}`,
});

const MovieListSection = ({ filtersConfig, movieListResponse }: MediaListSectionProps) => {
    return (
        <>
            {
                filtersConfig.map(config => (
                    <DropdownList
                        key={config.label}
                        {...config}
                    />
                ))
            }
            <MediaGrid mediaList={movieListResponse.results} extractTileProps={extractMovieProps} />
        </>
    );
};

export const MoviesLists = () => {

    const decadeOptions = getDecadeOptions();
    const [searchParams] = useSearchParams();
    const listTypeParam = searchParams.get("tab")!;

    const movieListQuery = useMediaList({
        mediaType: "movie",
        listType: listTypeParam || "popular",
        queryParams: { page: "1" }
    });

    console.log(movieListQuery);

    const movieFiltersConfig = [
        {
            options: decadeOptions,
            queryKey: "decades",
            label: "Decade",
        },
    ];

    if (!movieListQuery.data) return null;

    const tabsSectionsConfig: TabConfig[] = [
        {
            label: "Popular",
            view: (
                <>
                    <MovieListSection filtersConfig={movieFiltersConfig} movieListResponse={movieListQuery.data} />
                </>
            ),
            queryParam: "popular",
        },
        {
            label: "Top Rated",
            view: (
                <>
                    <MovieListSection filtersConfig={movieFiltersConfig} movieListResponse={movieListQuery.data} />
                </>
            ),
            queryParam: "top_rated",
        },
        {
            label: "Upcoming",
            view: (
                <>
                    <MovieListSection filtersConfig={movieFiltersConfig} movieListResponse={movieListQuery.data} />
                </>
            ),
            queryParam: "upcoming",
        },
    ];


    return (
        <section>
            <ListTitle>Movies Lists</ListTitle>
            <TabsPanel
                tabsConfig={tabsSectionsConfig}
            />
        </section>
    );
};
import { useSearchParams } from "react-router-dom";
import { TabConfig, TabsPanel } from "../../../common/components/TabsPanel";
import { ListSection, StyledMoviesList } from "./styled"
import { useMediaList } from "./useMovieList";
import { MediaGrid } from "../../../common/components/MediaGrid";
import { MovieListItem } from "../../../common/types/TmdbTypes/mediaListItem.types";
import { SectionTitle } from "../../../common/components/SectionTitle";
import { MovieListSidebar } from "./MovieListSidebar";
import { MovieList } from "../../../common/types/TmdbTypes/mediaList.types";
import { useFilterMovies } from "./useFilterMovies";
import { FiltersPanel } from "../../../common/components/Filter";
import { useGenresFilterConfig } from "../../../common/hooks/useGenresFilterConfig";
import { useDecadeFilterConfig } from "../../../common/hooks/useDecadeFilterConfig";
import { FilterConfig } from "../../../common/types/FilterConfig";
import { OrUndefined } from "../../../common/types/OrUndefined";
interface MediaListSectionProps {
    filtersConfig: FilterConfig[];
    movieListResponse: MovieList;
}

const extractMovieProps = (movie: MovieListItem) => ({
    imagePath: movie.poster_path,
    name: movie.title,
    detailsRoute: `/movie/${movie.id}`,
});

const MovieListSection = ({ filtersConfig, movieListResponse }: MediaListSectionProps) => {
    return (
        <>
            <FiltersPanel filtersConfig={filtersConfig} />
            <MediaGrid mediaList={movieListResponse} extractTileProps={extractMovieProps} />
        </>
    );
};


const useTopRatedTabConfig = (moviesList: OrUndefined<MovieList>): TabConfig => {
    const decadeFilterConfig = useDecadeFilterConfig();

    const filtersConfig = [decadeFilterConfig];
    const moviesToDisplay = useFilterMovies(moviesList, filtersConfig);

    const topRatedTabConfig = {
        label: "Top Rated",
        view: (
            <>
                <MovieListSection
                    filtersConfig={filtersConfig}
                    movieListResponse={moviesToDisplay}
                />
            </>
        ),
        queryParam: "top_rated",
    };

    return topRatedTabConfig;
};

const usePopularTabConfig = (moviesList: OrUndefined<MovieList>): TabConfig => {
    const genresFilterConfig = useGenresFilterConfig();

    const filtersConfig = [genresFilterConfig];
    const moviesToDisplay = useFilterMovies(moviesList, filtersConfig);

    const popularTabConfig = {
        label: "Popular",
        view: (
            <>
                <MovieListSection
                    filtersConfig={filtersConfig}
                    movieListResponse={moviesToDisplay}
                />
            </>
        ),
        queryParam: "popular",
    };

    return popularTabConfig;
};


const useUpcomingTabConfig = (moviesList: OrUndefined<MovieList>): TabConfig => {
    const genresFilterConfig = useGenresFilterConfig();

    const filtersConfig = [genresFilterConfig];
    const moviesToDisplay = useFilterMovies(moviesList, filtersConfig);

    const upcomingTabConfig = {
        label: "Upcoming",
        view: (
            <>
                <MovieListSection
                    filtersConfig={filtersConfig}
                    movieListResponse={moviesToDisplay}
                />
            </>
        ),
        queryParam: "upcoming",
    };

    return upcomingTabConfig;
};

export const useMoviesListsTabsConfig = (): TabConfig[] => {

    const [searchParams] = useSearchParams();
    const listTypeParam = searchParams.get("tab") || "popular";

    const movieListQuery = useMediaList({
        mediaType: "movie",
        listType: listTypeParam,
        queryParams: { page: "1" }
    });

    const moviesList = movieListQuery.data?.results;

    const topRatedTabConfig = useTopRatedTabConfig(moviesList);
    const popularTabConfig = usePopularTabConfig(moviesList);
    const upcomingTabConfig = useUpcomingTabConfig(moviesList);

    return [topRatedTabConfig, popularTabConfig, upcomingTabConfig];
};

export const MoviesLists = () => {
    const moviesListsTabsConfig = useMoviesListsTabsConfig();

    return (
        <StyledMoviesList>
            <MovieListSidebar />
            <ListSection>
                <SectionTitle>Movies Lists</SectionTitle>
                <TabsPanel
                    tabsConfig={moviesListsTabsConfig}
                />
            </ListSection>
        </StyledMoviesList>
    );
};
import { FiltersPanel } from "../../../common/components/Filter";
import { Sidebar } from "../../../common/components/Sidebar";
import { useDecadeFilterConfig } from "../../../common/hooks/useDecadeFilterConfig";
import { useGenresFilterConfig } from "../../../common/hooks/useGenresFilterConfig";
import { FilterConfig } from "../../../common/types/FilterConfig";
import { SectionTitle } from "../../../common/components/SectionTitle";
import { MediaGrid } from "../../../common/components/MediaGrid";
import { extractMovieProps } from "../../../common/functions/extractMovieProps";
import { useDiscoverMovies } from "./useDiscoverMovies";

export const Movies = () => {
    const genresFilterConfig = useGenresFilterConfig();
    const decadeFilterConfig = useDecadeFilterConfig();

    const movieFiltersConfig: FilterConfig[] = [genresFilterConfig, decadeFilterConfig];

    const discoverMovies = useDiscoverMovies({ endpointQueryParams: { ...genresFilterConfig.endpointQueryParam, ...decadeFilterConfig.endpointQueryParam, } })

    const movies = discoverMovies.data?.results;

    return (
        <>
            <Sidebar
                title="Filters"
                content={
                    <>
                        <FiltersPanel filtersConfig={movieFiltersConfig} />
                    </>
                }
            />
            <div>
                <SectionTitle>Movies Lists</SectionTitle>
                <MediaGrid mediaList={movies} extractTileProps={extractMovieProps} />
            </div>
        </>
    );
};
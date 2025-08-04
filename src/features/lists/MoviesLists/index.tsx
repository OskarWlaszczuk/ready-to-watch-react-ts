import { DropdownList, FilterOption } from "../../../common/components/DropdownList";
import { ListTab, ListTabsPanel, ListTitle } from "./styled"
import { useMediaList } from "./useMovieList";

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

export const MoviesLists = () => {

    const decadeOptions = getDecadeOptions();

    const movieList = useMediaList({ mediaType: "movie", listType: "popular", queryParams: { page: "1" } });


    const listTabsConfig = [
        {
            label: "Popular",
        },
        {
            label: "Top Rated",
        },
        {
            label: "Upcoming",
        },
        {
            label: "Now Playing",
        },
    ];

    return (
        <section>
            <ListTitle>Movies Lists</ListTitle>
            <ListTabsPanel>
                {
                    listTabsConfig.map(({ label }) => (
                        <ListTab key={label}>
                            {label}
                        </ListTab>
                    ))
                }
            </ListTabsPanel>
            <div>
                <DropdownList
                    options={decadeOptions}
                    queryKey={"decade"}
                    label="Decade"
                />
            </div>
        </section>
    );
};
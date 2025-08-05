import { MultiSelectList } from "../../../../common/components/MultiSelectList";
import { Sidebar } from "../../../../common/components/Sidebar";
import { capitalizeFirstLetter } from "../../../../common/functions/capitilizeFirstLetter";
import { formatToQueryParam } from "../../../../common/functions/formatToQueryParam";
import { useGenresQuery } from "../../../../common/hooks/useGenresQuery";
import { ListOptionType } from "../../../../common/types/FilterOption";

export const MovieListSidebar = () => {
    const genresQuery = useGenresQuery();

    const genreOptions: ListOptionType[] = genresQuery.genres?.map(({ name }) => ({ label: capitalizeFirstLetter(name), queryValue: formatToQueryParam(name) }))!;

    const sidebarFiltersConfig = [
        {
            listName: "genres",
            listOptions: genreOptions,
            listQueryKey: "genres",
        },
        {
            listName: "genres",
            listOptions: genreOptions,
            listQueryKey: "genres",
        },
        {
            listName: "genres",
            listOptions: genreOptions,
            listQueryKey: "genres",
        }
    ];

    const sidebarFilters = (
        sidebarFiltersConfig.map(config => (
            <MultiSelectList {...config} key={config.listName} />
        ))
    );

    return (
        <>
            <Sidebar title="Filters" content={<>{sidebarFilters}</>} />
        </>
    )
}
import { useSearchParams } from "react-router-dom";
import { ListOptionType } from "../types/ListOptionType";
import { FilterConfig } from "../types/FilterConfig";

export interface DecadeEndpointQueryParam {
    "primary_release_date.gte"?: string;
    "primary_release_date.lte"?: string;
}

export const useDecadeFilterConfig = () => {
    const [searchParams] = useSearchParams();

    const decades = [
        "2020s", "2010s", "2000s", "1990s", "1980s", "1970s",
        "1960s", "1950s", "1940s", "1930s", "1920s", "1910s",
        "1900s", "1890s", "1880s", "1870s"
    ];

    const decadeKey = "decade";
    const decadeParam = searchParams.get(decadeKey);

    const decadeOptions: ListOptionType[] = [
        ...decades.map(decade => ({ queryValue: decade, label: decade }))
    ];

    // const updateDecadeParam = useUpdateQueryParam();

    const decadeStartYear = Number(decadeParam?.replace("s", ""));

    const decadeRange = {
        start: decadeStartYear ? `${decadeStartYear}-01-01` : "",
        end: decadeStartYear ? `${decadeStartYear + 9}-12-31` : "",
    };

    const decadeEndpointParam: DecadeEndpointQueryParam = {
        "primary_release_date.gte": decadeRange.start,
        "primary_release_date.lte": decadeRange.end,
    };

    const decadeFilterConfig: FilterConfig = {
        label: "Decade",
        options: decadeOptions,
        queryKey: decadeKey,
        displayType: "dropdown",
        // updateFilterParam: updateDecadeParam,
        endpointQueryParam: decadeEndpointParam,
    };

    return decadeFilterConfig;
};


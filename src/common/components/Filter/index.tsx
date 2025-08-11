import { filterDisplayTypes } from "../../constants/filterDisplayTypes";
import { FilterConfig } from "../../types/FilterConfig";
import { DropdownList } from "../DropdownList"
import { MultiSelectList } from "../MultiSelectList"

interface FiltersPanelProps {
    filtersConfig: FilterConfig[]
}

export const FiltersPanel = ({ filtersConfig }: FiltersPanelProps) => {

    const selectFilterDisplay = (filterConfig: FilterConfig) => {
        switch (filterConfig.displayType) {
            case filterDisplayTypes.multiSelect:
                return <MultiSelectList {...filterConfig} key={filterConfig.label} />

            case filterDisplayTypes.dropdown:
                return <DropdownList key={filterConfig.label}{...filterConfig} />
        };
    };


    const filtersByDisplayType = (
        Object
            .values(filterDisplayTypes)
            .map(displayType => (
                filtersConfig.filter((config) => config.displayType === displayType)
            ))
    );

    return (
        <>
            {
                filtersByDisplayType.map(filtersConfig => (
                    <div>
                        {
                            filtersConfig.map(filterConfig => (
                                selectFilterDisplay(filterConfig)
                            ))
                        }
                    </div>
                ))
            }
        </>
    );
};
import { useState } from "react";
import { ListOptionType } from "../../types/FilterOption";
import { ExpandOptionsButton, ListName, ListOption, ListOptions, StyledMultiSelectList } from "./styled"
import { capitalizeFirstLetter } from "../../functions/capitilizeFirstLetter";
import { Arrow } from "../DropdownList/styled";
import { useUpdateQueryParams } from "./useUpdateQueryParams";

export interface MultiSelectListProps {
    listName: string;
    listOptions: ListOptionType[];
    listQueryKey: string;
}

export const MultiSelectList = ({ listName, listOptions, listQueryKey }: MultiSelectListProps) => {
    const [showAllOptions, setShowAllOptions] = useState(false)
    const sliceCount = !showAllOptions ? listOptions?.length / 2 : undefined
    const { currentListParams, updateQueryParams } = useUpdateQueryParams(listQueryKey);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <StyledMultiSelectList>
            <ListName
                $activeList={isOpen}
                onClick={() => setIsOpen(boolean => !boolean)}
            >
                <Arrow $open={isOpen} />
                {capitalizeFirstLetter(listName)}
            </ListName>
            {
                isOpen && (
                    <>
                        <ListOptions>
                            {
                                listOptions?.slice(sliceCount).map(({ queryValue, label }) => (
                                    <ListOption
                                        $activeOption={currentListParams.includes(queryValue)}
                                        key={queryValue}
                                        onClick={() => updateQueryParams(queryValue)}
                                    >{label}
                                    </ListOption>
                                ))
                            }
                        </ListOptions>
                        <ExpandOptionsButton
                            onClick={() => setShowAllOptions(boolean => !boolean)}
                        >
                            {showAllOptions ? "Show less" : "Show more"}
                        </ExpandOptionsButton>
                    </>
                )
            }
        </StyledMultiSelectList>
    );
};
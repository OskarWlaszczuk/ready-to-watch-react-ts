import { useState } from "react";
import { ListOptionType } from "../../types/ListOptionType";
import { ExpandOptionsButton, ListName, ListOption, ListOptions, StyledMultiSelectList } from "./styled"
import { capitalizeFirstLetter } from "../../functions/capitilizeFirstLetter";
import { Arrow } from "../DropdownList/styled";
import { useUpdateQueryParams } from "./useUpdateQueryParams";
import { ListConfig } from "../../types/ListConfig";

export interface MultiSelectListProps extends ListConfig { }

export const MultiSelectList = ({ label, options, queryKey }: MultiSelectListProps) => {
    const [showAllOptions, setShowAllOptions] = useState(false)
    const sliceCount = !showAllOptions ? options?.length / 2 : undefined
    const { currentListParams, updateQueryParams } = useUpdateQueryParams(queryKey);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <StyledMultiSelectList>
            <ListName
                $activeList={isOpen}
                onClick={() => setIsOpen(boolean => !boolean)}
            >
                <Arrow $open={isOpen} />
                {capitalizeFirstLetter(label)}
            </ListName>
            {
                isOpen && (
                    <>
                        <ListOptions>
                            {
                                options?.slice(sliceCount).map(({ queryValue, label }) => (
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
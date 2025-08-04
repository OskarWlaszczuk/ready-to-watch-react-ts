import { useState } from "react";
import { Arrow, ListOption, ListLabel, StyledDropdownList, ListOptions } from "./styled";
import { useSearchParams } from "react-router-dom";
import { FilterOption } from "../../types/FilterOption";
import { useUpdateQueryParam } from "../../hooks/useUpdateQueryParam";


export interface DropdownListProps {
    options: FilterOption[];
    queryKey: string;
    label: string;
}

export const DropdownList = ({ options, queryKey, label }: DropdownListProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchParams] = useSearchParams();

    const updateQueryParam = useUpdateQueryParam();

    const queryParam = searchParams.get(queryKey);

    const selectedOption = options.find((option) => option.queryValue === queryParam);

    const onListClick = () => setIsOpen(boolean => !boolean);

    const onOptionChange = (newQueryValue: FilterOption["queryValue"]) => {
        updateQueryParam(newQueryValue, queryKey);
        setIsOpen(false);
    };

    const unrolledOptions = (
        <ListOptions>
            {options.map(({ label, queryValue }) => (
                <ListOption
                    $selected={queryValue === queryParam}
                    key={queryValue}
                    onClick={() => onOptionChange(queryValue)}
                >
                    {label}
                </ListOption>
            ))}
        </ListOptions>
    );

    const listLabel = `${label}${!!selectedOption ? `: ${selectedOption.queryValue}` : ""}`;

    return (
        <StyledDropdownList>
            <ListLabel onClick={onListClick}>
                {listLabel}
                <Arrow $open={isOpen}>▼</Arrow>
            </ListLabel>
            {isOpen && (
                unrolledOptions
            )}
        </StyledDropdownList>
    );
};
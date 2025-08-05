import { useState } from "react";
import { Arrow, ListOption, ListLabel, StyledDropdownList, ListOptions } from "./styled";
import { useSearchParams } from "react-router-dom";
import { ListOptionType } from "../../types/ListOptionType";
import { useUpdateQueryParam } from "../../hooks/useUpdateQueryParam";
import { ListConfig } from "../../types/ListConfig";

export interface DropdownListProps extends ListConfig { }

export const DropdownList = ({ options, queryKey, label }: DropdownListProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchParams] = useSearchParams();

    const updateQueryParam = useUpdateQueryParam();

    const queryParam = searchParams.get(queryKey);

    const selectedOption = options.find((option) => option.queryValue === queryParam);

    const onListClick = () => setIsOpen(boolean => !boolean);

    const onOptionChange = (newQueryValue: ListOptionType["queryValue"]) => {
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
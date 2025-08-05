import styled, { css } from "styled-components";
import { ReactComponent as VectoIcon } from "../../../Vector.svg"


export const StyledDropdownList = styled.div`
  position: relative;
  user-select: none;
`;

export const ListLabel = styled.div`
    display: flex;
    gap: 5px;
    justify-items: center;
    color:${({ theme }) => theme.colors.doveGray};
    background-color: ${({ theme }) => theme.colors.white};
    border: 1px solid ${({ theme }) => theme.colors.mercury};
    border-radius: 12px;
    padding: 3px 7px;
    cursor: pointer;
    font-size: ${({ theme }) => theme.fontSizes.xs};
    font-weight: ${({ theme }) => theme.fontWeights.regular};

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover.shadowWhite};
  }
`;

export const ListOptions = styled.ul`
    position: absolute;
        background-color: ${({ theme }) => theme.colors.white};
    /* top: 100%; */
    /* left: 0; */
    /* right: 0; */
    box-shadow: 0 0 1px 0 rgb(0, 0, 0, .2667), 0 4px 6px -1px rgba(0, 0, 0, .1), 0 2px 4px -2px rgba(0, 0, 0, .1);
    border-radius: 6px;
    margin: 4px 0 0 0;
    padding: 0;
    list-style: none;
    /* background: white; */
    max-height: 150px;
    min-width: 166px;
    overflow-y: auto;
    z-index: 10;
    display: flex;
    flex-direction: column;
    padding: 16px 8px;
    gap: 10px;

    /* width: 200%; */
`;

interface OptionProps {
    $selected: boolean;
}

export const ListOption = styled.li<OptionProps>`
    color:${({ theme }) => theme.colors.mineShaft};
    cursor: pointer;
    font-size: ${({ theme }) => theme.fontSizes.s};
    padding: 8px 17px;
    border-radius: 6px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.hover.gallery};
    ${({ $selected }) => $selected && css`
        background-color: transparent; 
  `}
  }

  ${({ $selected }) => $selected && css`
        opacity: 0.4;
        background-color: transparent; 
  `}
`;

interface ArrowProps {
    $open: boolean;
}

export const Arrow = styled(VectoIcon) <ArrowProps>`
   path {
        fill:${({ theme }) => theme.colors.doveGray};
        opacity: 0.5;
    };
    transform: ${({ $open }) => ($open ? 'rotate(90deg)' : 'rotate(270deg)')};
    transition: transform 0.2s ease;
`;
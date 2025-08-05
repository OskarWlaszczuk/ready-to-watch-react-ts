import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const StyledMediaTile = styled(NavLink)`
    
`;

export const MediaImage = styled.img`
    width: 100%;
    border-radius: 8px;
    cursor: pointer;
    transition: outline 0.2s;
    aspect-ratio: 2 / 3;

    &:hover {
        outline: 6px solid ${({ theme }) => theme.colors.seance};
    }
`;
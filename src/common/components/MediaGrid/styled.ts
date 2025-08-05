import styled from "styled-components";

export const GridList = styled.div`
    display: grid;
    grid-gap: 12px;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    flex-grow: 1;
`;
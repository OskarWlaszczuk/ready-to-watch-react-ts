import styled from "styled-components";

export const StyledLayout = styled.div`
  display: grid;
  grid-template-columns: 64px 1fr;
  grid-template-rows: auto 1fr 1fr;
  grid-template-areas:
    "search search search"
    "nav main main"
    "nav main main";
  height: 100%;
`;

export const MainContent = styled.main`
  grid-area: main;
  overflow-y: auto;
`;
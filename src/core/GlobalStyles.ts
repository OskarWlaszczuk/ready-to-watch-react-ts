import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    html {
        box-sizing: border-box;
    };

    *, ::after, ::before {
        box-sizing: inherit;
    };

    body {
        margin: 0;
        background-color: ${({ theme }) => theme.colors.white};
    };

    #root {
        height: 100vh;
        font-family: "Rubik", sans-serif;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
    };
`;
import { Outlet } from "react-router-dom";
import { MainContent, StyledLayout } from "./styled";
import { SearchPanel } from "./SearchPanel";
import { NavPanel } from "./NavPanel";

export const Layout = () => {
    return (
        <StyledLayout>
                <SearchPanel />
                <NavPanel />
            <MainContent>
                <Outlet />
            </MainContent>
        </StyledLayout>
    );
};
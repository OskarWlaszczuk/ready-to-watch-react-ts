import { NavLink } from "react-router-dom"
import { Search, StyledSearchPanel } from "./styled"
import { authApiSecure } from "../../../../common/constants/api";
import { useAccessToken } from "../../../../common/hooks/useAccessToken";

export const SearchPanel = () => {
    //@ts-ignore
    const { accessToken } = useAccessToken();

    //dodać blok try/catch do łapanie błedów z serwera
    const logout = async () => {
        try {
            await authApiSecure.delete("/logout");
        } catch (error) {

        }
    };

    return (
        <StyledSearchPanel>
            <Search placeholder="Search for new seans..."></Search>
            {
                !accessToken && (
                    <>
                        <NavLink to="/auth/login">Login</NavLink>
                        <NavLink to="/auth/register">Register</NavLink>
                    </>
                )
            }
            {
                accessToken && (
                    <button onClick={logout}>Logout</button>
                )
            }
        </StyledSearchPanel>
    );
};
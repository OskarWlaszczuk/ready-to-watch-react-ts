import { NavLink, useNavigate } from "react-router-dom"
import { Search, StyledSearchPanel } from "./styled"
import { authApiSecure } from "../../../../common/constants/api";
import { useAccessToken } from "../../../../common/hooks/useAccessToken";
import { useQueryClient } from "@tanstack/react-query";

export const SearchPanel = () => {
    //@ts-ignore
    const { accessToken } = useAccessToken();
    const navigate = useNavigate();

    //dodać blok try/catch do łapanie błedów z serwera
    const queryClient = useQueryClient();
    const logout = async () => {
        try {
            await authApiSecure.delete("/logout");
            queryClient.setQueryData(["secureUser"], null);
            queryClient.setQueryData(["accessToken"], null);

            navigate("/home"); // lub inna strona po zalogowaniu
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
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { publicAuthApi } from "../../../common/constants/api";
import { useQueryClient } from "@tanstack/react-query";
import { useAccessToken } from "../../../common/hooks/useAccessToken";
import { useUserSecure } from "../../../common/hooks/useUserSecure";

export const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ nickname: "", password: "" });
    const [error, setError] = useState("");
    const queryClient = useQueryClient();
    const { accessToken } = useAccessToken();
    const {
        user: nickname,
        status,
        isPaused,
        //@ts-ignore
    } = useUserSecure({ accessToken, resource: "nickname" });
    //@ts-ignore

    //@ts-ignore
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    //@ts-ignore
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nickname || !formData.password) {
            setError("Wszystkie pola są wymagane");
            return;
        }

        try {
            const { data } = await publicAuthApi.post("/login", formData);
            queryClient.setQueryData(["accessToken"], data.data.accessToken);
            queryClient.setQueryData(["secureUser", "nickname"], data.data.user.nickname);
            //dodanie do query 'access token' wartości z data!

            navigate("/home"); // lub inna strona po zalogowaniu
            //@ts-ignore
        } catch (err) {
            console.log(err)
            //@ts-ignore
            setError(err.response.data.message);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label htmlFor="nickname">nickname*</label>
                <input
                    required
                    type="nickname"
                    id="nickname"
                    name="nickname"
                    placeholder="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                />

                <label htmlFor="password">Password*</label>
                <input
                    required
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <button type="submit">Login</button>
            </form>
            <NavLink to="/auth/register">Don't have an account? Register</NavLink>
        </div>
    );
};

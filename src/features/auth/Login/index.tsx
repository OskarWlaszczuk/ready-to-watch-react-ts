import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { authApiPublic } from "../../../common/constants/api";
import { useQueryClient } from "@tanstack/react-query";

export const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ nickname: "", password: "" });
    const [error, setError] = useState("");
    const queryClient = useQueryClient();
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
            const { data } = await authApiPublic.post("/login", formData);
            console.log(data)
            queryClient.setQueryData(["accessToken"], data.data.accessToken);
            queryClient.setQueryData(["secureUser"], data.data.user);
            const user = queryClient.getQueryData(["secureUser"]);
            const token = queryClient.getQueryData(["accessToken"]);
            console.log(user, token)
            //dodanie do query 'access token' wartości z data!

            navigate("/home"); // lub inna strona po zalogowaniu
        } catch (err) {
            setError("Błąd sieci, spróbuj ponownie");
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

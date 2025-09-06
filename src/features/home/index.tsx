import { useAccessToken } from "../../common/hooks/useAccessToken";
import { useUserSecure } from "../../common/hooks/useUserSecure";

export const Home = () => {
    const { accessToken } = useAccessToken();

    const {
        user,
        status,
        isPaused,
        error,
        //@ts-ignore
    } = useUserSecure(accessToken);

    return (
        <>
            {
                !accessToken ?
                    "Sesja wygasła" :
                    <>
                        Welcome {!!user && (
                            //@ts-ignore
                            user?.nickname
                        )}
                    </>
            }
        </>
    );
};
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const [countdown, setCountdown] = useState(3);
    const navigate = useNavigate();

    const hasAuthToken = localStorage.getItem("authToken");
    const redirectPath = hasAuthToken ? "/statistics" : "/signin";
    const redirectLabel = hasAuthToken ? "Главную" : "страницу авторизации";

    useEffect(() => {
        // Таймер обратного отсчета
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate(redirectPath);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate, redirectPath]);

    return (
        <div>
            <h1>Страница не найдена</h1>
            <p>
                Возврат на {redirectLabel} через {countdown}
            </p>
        </div>
    );
};

export default NotFound;
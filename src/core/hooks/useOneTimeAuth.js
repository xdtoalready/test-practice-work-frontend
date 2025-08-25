import { useLayoutEffect } from 'react';
import {apiClient2} from "../../shared/api/client";

const useOneTimeAuth = (chatToken, setIsLoaded) => {
    useLayoutEffect(() => {
        if (!chatToken) return;

        const storageKey = `oneTimeAuthExecuted_${chatToken}`;

        if (localStorage.getItem(storageKey)) {
            setIsLoaded(true);
            return;
        }

        apiClient2.get(`${process.env.REACT_APP_API_URL_2}/api/one_time_auth`, {
            params: { token: chatToken },
            withCredentials: true
        })
            .catch((e) => console.error(e))
            .finally(() => {
                setTimeout(() => setIsLoaded(true), 300);
                localStorage.setItem(storageKey, 'true');
            });

    }, [chatToken, setIsLoaded]);
};

export default useOneTimeAuth;
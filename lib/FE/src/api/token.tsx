import { refresh } from "./authApi";

const isTokenExpiringSoon = (token: string): boolean => {
    try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        const timeLeft = decodedToken.exp - currentTime;
        const threshold = 300;
        return timeLeft < threshold;
    } catch (error) {
        console.error("Error decoding token:", error);
        return true;
    }
};

const handleTokenRefresh = async (): Promise<string> => {
    const token = localStorage.getItem('token');
    if (!token || !isTokenExpiringSoon(token)) {
        return token || '';
    }
    try {
        const newToken = await refresh();
        localStorage.setItem('token', newToken);
        return newToken;
    } catch (error) {
        console.error('Error refreshing token', error);
        throw error;
    }
};

export { handleTokenRefresh }

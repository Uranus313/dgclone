import { useContext } from "react";
import userContext from "../contexts/userContext";

export const useUser = () => {
    const context = useContext(userContext);
    if (!context) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
};
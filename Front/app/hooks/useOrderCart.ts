import { useContext } from "react";
import orderCartContext from "../contexts/orderCartContext";

export const useOrderCart = () => {
    const context = useContext(orderCartContext);
    if (!context) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
};

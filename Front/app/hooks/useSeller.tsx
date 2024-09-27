import { useContext } from "react";
import sellerContext from "../contexts/sellerContext";

export const useSeller = () => {
    const context = useContext(sellerContext);
    if (!context) {
        throw new Error('useOrder must be used within an OrderProvider');
    }
    return context;
};
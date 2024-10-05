import { useContext } from "react";
import categoriesContext from "../contexts/categoriesContext";

export const useGetAllCate = () => {
    const context = useContext(categoriesContext);
    if (!context) {
        throw new Error('useGetAllCate Error khodam neveshtam error ro');
    }
    return context;
};

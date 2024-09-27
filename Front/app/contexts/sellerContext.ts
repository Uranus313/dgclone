import { createContext } from "react";
import { Seller } from "../components/Interfaces/interfaces";

interface sellerContextType {
    seller: Seller | null;
    setSeller: React.Dispatch<React.SetStateAction<Seller | null>>;
    isLoading: boolean;
}

let sellerContext = createContext<sellerContextType | undefined>(undefined);

export default sellerContext;
import { createContext } from "react";
import { Category } from "../(Customer)/page";


interface categoriesContextType {
    categories: Category[]|undefined;
    setCategories: React.Dispatch<React.SetStateAction<Category[]|undefined>>;
}

let categoriesContext = createContext<categoriesContextType | undefined>(undefined);

export default categoriesContext;
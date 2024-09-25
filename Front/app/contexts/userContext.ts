import { createContext } from "react";
import { User } from "../components/Interfaces/interfaces";

interface userContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isLoading: boolean;
}

let userContext = createContext<userContextType | undefined>(undefined);

export default userContext;
import { createContext } from "react";
import { Order } from "../components/Interfaces/interfaces";

interface OrderContextType {
    orderCart: Order[];
    setOrderCart: React.Dispatch<React.SetStateAction<Order[]>>;
}

let orderCartContext = createContext<OrderContextType | undefined>(undefined);

export default orderCartContext;
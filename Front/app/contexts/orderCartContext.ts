import { createContext } from "react";
import { Order, OrdersHistory } from "../components/Interfaces/interfaces";

interface OrderContextType {
    orderCart: OrdersHistory;
    setOrderCart: React.Dispatch<React.SetStateAction<OrdersHistory>>;
}

let orderCartContext = createContext<OrderContextType | undefined>(undefined);

export default orderCartContext;
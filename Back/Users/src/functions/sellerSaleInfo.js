import { productURL } from "../consts/consts.js";

export async function sellerSaleInfo(sellerID) {
    try {
       const result = await fetch(productURL + "/sellerSaleInfo/"+sellerID, {
        method: "GET",
        headers: {
            "inner-secret": process.env.innerSecret
        }}); 
    return result;

    } catch (error) {
        const result = {}
    return result;
    }
    
    
}
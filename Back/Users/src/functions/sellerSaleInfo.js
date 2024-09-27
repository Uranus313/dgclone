import { productURL } from "../consts/consts";

export async function sellerSaleInfo(sellerID){
    const result = await fetch(productURL + "/sellerSaleInfo/"+sellerID, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "inner-secret": process.env.innerSecret
        },
        body: JSON.stringify(neededProducts)
    });
    return result;
}
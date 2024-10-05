import { ReadonlyURLSearchParams } from "next/navigation";
import { Category } from "../(Customer)/page";

export async function getCategory(id: string): Promise<Category | undefined> {
    let category: Category | undefined;
    let found = false;
    const res = await fetch("http://localhost:8080/products/category");
    const categories: Category[] = await res.json();
    categories.forEach(category1 => {
        if (category1.ID === id && !found) {
            category = category1;
            found = true;
            return;
        } else {
            category1.Childs?.forEach(category2 => {
                if (category2.ID === id && !found) {
                    category = category2;
                    found = true;
                    return;
                } else {
                    category2.Childs?.forEach(category3 => {
                        if (category3.ID === id && !found) {
                            category = category3;
                            found = true;
                            return;
                        }
                    });
                }
            });
        }
    });

    return category;
}

interface QueryProp {
    dicts: { param: string, value: string }[],
    searchParams: ReadonlyURLSearchParams
}

export function updateQueries({ dicts, searchParams }: QueryProp) {
    const params = new URLSearchParams(searchParams.toString());
    dicts.forEach(dict => {
        params.set(dict.param, dict.value);
    });
    window.history.pushState(null, '', `?${params.toString()}`);
}

// const handleRemoveQueryParam = (paramToRemove:string , searchParams:URLSearchParams , pathname:string , searchquery:string , router ) => {
//   searchParams.delete(paramToRemove);
//   const newUrl = `${router.pathname}?${searchParams.toString()}`;
//   router.replace(newUrl);
// };

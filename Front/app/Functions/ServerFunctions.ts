
import { ReadonlyURLSearchParams } from "next/navigation";
import { Categories, Category } from "../(Customer)/page";

export function getCategory(id: string): Category | undefined {
    let category: Category | undefined;
    let found = false
    Categories.forEach(category1 => {
        if (category1.id === id && !found) {
            category = category1;
            found = true
            return
        } else {
            category1.children?.forEach(category2 => {
                if (category2.id === id && !found) {
                    category = category2;
                    found = true
                    return
                } else {
                    category2.children?.forEach(category3 => {
                        if (category3.id === id && !found) {
                            category = category3;
                            found = true
                            return
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
    const params = new URLSearchParams(searchParams.toString())
    dicts.forEach(dict => {
        params.set(dict.param, dict.value)
    });
    window.history.pushState(null, '', `?${params.toString()}`)
}


// const handleRemoveQueryParam = (paramToRemove:string , searchParams:URLSearchParams , pathname:string , searchquery:string , router ) => {
//   searchParams.delete(paramToRemove);
//   const newUrl = `${router.pathname}?${searchParams.toString()}`;
//   router.replace(newUrl);
// };




import { Categories, Category } from "../page";

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

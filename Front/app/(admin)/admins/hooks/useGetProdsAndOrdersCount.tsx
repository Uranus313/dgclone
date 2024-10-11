import { useQuery } from "@tanstack/react-query";

function useGetProdsAndOrdersCount() {
    return useQuery({
        queryKey: ['productOrderCount'],
        queryFn: async () => {
            const result = await fetch("https://localhost:8080/products/prodAndOrdersCount", {
                credentials: 'include'
            });
            const jsonResult = await result.json();
            console.log(jsonResult)
            if (result.ok) {
                return jsonResult
            } else {
                throw new Error(jsonResult.error);
            }
        },
        staleTime: 6 * 60 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 2
    })
}
export default useGetProdsAndOrdersCount;
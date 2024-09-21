import { useQuery } from "@tanstack/react-query";

interface Role{
    roleID : string
}

function useGetRoleEmployeeCount(role: Role) {
    return useQuery({
        queryKey: ['roleEmployeeCount', role],
        queryFn: async () => {
            const result = await fetch("http://localhost:3005/users/general/employeeCount"+`?roleID=${role.roleID}`, {
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
export default useGetRoleEmployeeCount;
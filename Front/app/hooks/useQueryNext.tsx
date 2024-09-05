import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function useQueryNext(){
    const manage = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const c = new URLSearchParams(searchParams)
      const handleRemoveQueryParam = (paramToRemove:string) => {
        c.delete(paramToRemove);
        const newUrl = `${pathname}?${c.toString()}`;
        manage.replace(newUrl);
    };

    return {manage:manage , searchParams:searchParams , pathname:pathname , handleRemoveQueryParam:handleRemoveQueryParam}

}
"use client";

import qs from "query-string";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import useDebounce from "@/hooks/useDebounce";

import Input from "./Input";

const SearchInput = () => {
    const router = useRouter();
    const [value, SetValue] = useState<string>("");
    const debouncedValue = useDebounce<string>(value,500);

    useEffect(() => {
        const query = {
            title: debouncedValue,
        };

        const url = qs.stringifyUrl({
            url: '/search',
            query: query
        });

        router.push(url);
    }, [debouncedValue, router]);

    return(
        <Input 
        placeholder="Ne dinlemek istiyorsun?"
        value={value}
        onChange={(e) => SetValue(e.target.value)}
        />
    );
}

export default SearchInput;
import { useEffect, useState } from "react";

function useDebounce<T>(value: T, delay?: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

useEffect(() => {
    const timer = setTimeout(()=> {
        setDebouncedValue(value)
    }, delay || 500); //kullanıcı bir sey yazmadan 500 ms sonra arama sonuclar gözükecek sekilde ayarlandı (api calls tekrar kullanmamak icin)

    return() => {
        clearTimeout(timer);
    }
}, [value, delay]);

return debouncedValue;
};

export default useDebounce;
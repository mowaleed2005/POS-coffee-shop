import { useEffect, useState } from "react"


export default function useDebounce(value, delay = 400) {

    const [debounce, setDebounce] = useState(value);

    useEffect(() => {
        const time = setTimeout(() => setDebounce(value), delay);
        return clearTimeout(time)
    }, [value, delay]);

    return debounce
}

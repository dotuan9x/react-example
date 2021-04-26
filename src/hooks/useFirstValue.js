import {useEffect, useRef} from 'react';

export default function useFirstValue(value) {
    const ref = useRef(null);
    const first = useRef(true);

    // Store current value in ref
    useEffect(() => {
        if (value && first.current) {
            first.current = false;
            ref.current = value;
        }
    }, [value]); // Only re-run if value changes

    // Return first value
    return ref.current || value;
}
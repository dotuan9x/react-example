import {useEffect, useRef} from 'react';
import isEqual from 'react-fast-compare';

function useDeepCompareMemoize(value) {
    const ref = useRef();

    if (!isEqual(value, ref.current)) {
        ref.current = value;
    }

    return ref.current;
}

function useDeepCompareEffect(callback, dependencies) {
    useEffect(callback, useDeepCompareMemoize(dependencies));
}

export default useDeepCompareEffect;
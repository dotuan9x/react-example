// Libraries
import {useCallback, useReducer} from 'react';
import produce from 'immer';

const useImmerReducer = (reducer, initialState = {}) => {
    const cachedReducer = useCallback(produce(reducer), [reducer]);

    return useReducer(cachedReducer, initialState);
};

export default useImmerReducer;
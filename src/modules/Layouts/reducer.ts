import {combineReducers} from 'redux';

import {userReducer} from './containers/Login/reducer';
import {defaultMainReducer} from './containers/DefaultMain/reducer';

const initialState = {
 
};

const layoutReducer = (state: {} = initialState, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

export const reducer = combineReducers({
    layoutReducer,
    userReducer,
    defaultMainReducer
});

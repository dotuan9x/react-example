import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {reducer as Layouts} from './modules/Layouts/reducer';

import rootSaga from './middleware';

import {appConfig} from 'Src/constant';

const appReducer = combineReducers({
    Layouts: Layouts
});

let store: {} = {};

const sagaMiddleware = createSagaMiddleware();

if (appConfig.APPLICATION_ENV === 'development') {
    const composeEnhancers =  typeof window === 'object' && window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] ?
        window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']({
            trace: true,
            traceLimit: 25
        }) : compose;

    store = createStore(appReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));
} else {
    store = createStore(appReducer, applyMiddleware(sagaMiddleware));
}

sagaMiddleware.run(rootSaga);

export default store;

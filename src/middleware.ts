import {all} from 'redux-saga/effects';
import {monitorMiddleware} from 'Modules/Monitor/middleware';

export default function* rootSaga () {
    yield all ([
        monitorMiddleware()
    ]);
}

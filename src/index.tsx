import React from 'react';
import ReactDOM from 'react-dom';
import {init as monitorInit} from '@antscorp/monitor-javascript';
import App from './App';

import {appConfig} from 'Src/constant';

// Init monitor
monitorInit({
    pid: appConfig.MONITOR_PID,
    env: appConfig.APPLICATION_ENV,
    host: appConfig.API_LOGGING_ERROR + 'api/log'
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

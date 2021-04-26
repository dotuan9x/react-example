// Libraries
import {takeEvery, select} from 'redux-saga/effects';
import moment from 'moment';
import axios from 'axios';

// Actions
import {types} from './actions';

// Utils
import {checkJSON, getCookie, getObjectPropSafely} from 'Src/utils';
import {appConfig} from 'Src/constant';

let logs = [];
let actions = [];
let locations = {};

function* getActionLogs() {
    try {
        const APILogging = appConfig.API_LOGGING_ERROR ? appConfig.API_LOGGING_ERROR : '';

        if (APILogging) {
            let responseActions = yield axios.get(APILogging + 'api/actions', {
                params: {
                    projectId: 2,
                    page: 1,
                    limit: 1000
                }
            });

            if (responseActions && responseActions.data && responseActions.data.data && responseActions.data.data.actions && responseActions.data.data.actions.length) {
                actions = responseActions.data.data.actions;
            }
        }
    } catch (e) {
        // Error
    }
}

function* monitorInit() {
    try {
        // Actions log
        yield getActionLogs();
    } catch (e) {
        // Error
    }
}

function* monitorLog(args) {
    try {
        const time = moment().format('YYYY-MM-DD hh:mm:ss');
        let state = yield select();

        if (args && state.Layouts.userReducer) {
            let {userId = '', fullName = '', email = '', accountId = ''} = state.Layouts.userReducer;
            let accountName = localStorage.getItem('user_logged_in_full_name');

            if (!userId || typeof userId === 'undefined') {
                userId = localStorage.getItem('user_logged_in_user_id');
            }

            if (!email || typeof email === 'undefined') {
                email = localStorage.getItem('user_logged_in_email');
            }

            if (!accountId || typeof accountId === 'undefined') {
                accountId = userId;
            }

            let traceId = '';

            if (traceId) {
                traceId = JSON.parse(traceId);
            }

            // Request Id
            let uniqueId = moment.now() + '' + Math.floor(Math.random() * 10000);

            if (args.payload) {
                const {
                    actionId,
                    appName = '',
                    reportId = '',
                    reportName = '',
                    connectorId = '',
                    connectorName = '',
                    notes = {},
                    logType = 'actions',
                    type = 'Component',
                    action = '',
                    object = '',
                    dimension = {}
                } = args.payload || {};

                let logData = {
                    log_level: 'info',
                    application_id: 1,
                    application: 'antalyser',
                    user_id: userId,
                    network_id: appConfig.API_ID,
                    type,
                    name: '',
                    log_type: logType,
                    metric: {},
                    dimension: {
                        unique_id: uniqueId,
                        project_id: 2,
                        project_name: 'antalyser',
                        network_id: appConfig.API_ID,
                        user_id: userId,
                        user_name: fullName,
                        email,
                        account_id: accountId,
                        account_name: accountName,
                        href: window.location.href,
                        ...dimension,
                        ...locations
                    },
                    trace_id: traceId,
                    timestamp: time
                };

                if (actionId && actions.length) {
                    let actionInfo = actions.find(action => {
                        return action.actionId === actionId;
                    });

                    if (actionInfo) {
                        let {
                            objectType = '',
                            actionName = ''
                        } = actionInfo;

                        const objectName = getObjectPropSafely(() => args.payload[actionInfo.objectName]) || '';
                        const objectId = getObjectPropSafely(() => args.payload[actionInfo.objectId] ) || '';

                        logData.action_id = actionId;
                        logData.object_name = objectName;
                        logData.object_id = objectId;
                        logData.dimension = {
                            ...logData.dimension,
                            action_id: actionId,
                            action_name: actionName,
                            object_id: objectId,
                            object_name: objectName,
                            object_type: objectType,
                            app_id: 3,
                            app_name: appName
                        };

                        if (reportId) {
                            logData.dimension.report_id = reportId;
                        }

                        if (reportName) {
                            logData.dimension.report_name = reportName;
                        }

                        if (connectorId) {
                            logData.dimension.connector_id = connectorId;
                        }

                        if (connectorName) {
                            logData.dimension.connector_name = connectorName;
                        }

                        if (notes) {
                            logData.notes = notes;
                        }
                    }
                }

                if (getObjectPropSafely(() => args.payload.args)) {
                    logData.dimension.args = JSON.stringify(args.payload.args);
                }

                // Get account information (auth, actor, actee)
                logData.auth_id = userId;
                logData.auth_name = email || fullName;

                logData.actor_id = userId;
                logData.actor_name = email || fullName;

                if (sessionStorage) {
                    const persistentSu = sessionStorage.getItem(`ADX_BUYER.persistent.su.${userId}`);
                    const {user_id: acteeId = '', email = '', full_name: acteeName = ''} = checkJSON(persistentSu) && JSON.parse(persistentSu) || {};

                    if (userId && fullName) {
                        logData.actee_id = acteeId;
                        logData.actee_name = email || acteeName;
                    }
                }

                if (!logData.actee_id) {
                    logData.actee_id = userId;
                }

                if (!logData.actee_name) {
                    logData.actee_name = fullName;
                }

                if (action) {
                    logData.action = action;
                }

                if (object) {
                    logData.object = object;
                }

                if (logData) {
                    logs.push(logData);
                }
            }
        }

        if (logs.length >= 1 && logs.length < 1000) {
            const arrLogs = [...logs];

            logs = [];

            const APILogging = appConfig.API_LOGGING ? appConfig.API_LOGGING : '';

            if (APILogging && appConfig.APPLICATION_ENV) {
                switch (appConfig.APPLICATION_ENV) {
                    case 'development':
                    case 'sandbox':
                    case 'production':
                    case 'staging':
                        arrLogs.forEach((log) => {
                            axios.post(APILogging, {
                                ...log
                            });
                        });
                        break;
                }
            }
        }
    } catch (e) {
        // Error
    }
}

export function* monitorMiddleware() {
    yield takeEvery(types.MONITOR_LOG, monitorLog);
    yield takeEvery(types.MONITOR_INIT, monitorInit);
}

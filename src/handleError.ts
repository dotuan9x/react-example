// Libraries
import {handleError as sendError} from '@antscorp/monitor-javascript';

import {appConfig} from 'Src/constant';
import {getCookie} from 'Src/utils';

export function handleError(error, payload: {}) {
    try {
        if (error) {
            if (appConfig.APPLICATION_ENV) {
                switch (appConfig.APPLICATION_ENV) {
                    case 'development':
                        console.error(error);

                        sendMessageError({
                            error,
                            ...payload
                        });
                        break;
                    case 'sandbox':
                    case 'production':
                        sendMessageError({
                            error,
                            ...payload
                        });
                        break;
                }
            }
        }
    } catch (error) {
        //
    }
}

interface userInfoType {
    user_id: string;
    account_id: string;
    token: string;
}

function sendMessageError(payload: {error?: string, args?: {}}) {
    try {
        if (payload.error) {
            let error = payload.error;
            let userInfo: string = getCookie(appConfig.U_OGS) || '';
            let token: string = '',
                userId: string = '',
                accountId: string = '';

            if (userInfo) {
                let newUserInfo: userInfoType = JSON.parse(userInfo);

                if (newUserInfo && newUserInfo.user_id && newUserInfo.account_id && newUserInfo.token) {
                    token = newUserInfo.token;
                    userId = newUserInfo.user_id;
                    accountId = newUserInfo.account_id;
                }
            }

            let traceId = '';

            if (traceId) {
                traceId = JSON.parse(traceId);
            }

            // Logging info
            let logging = {
                ...payload,
                args: {
                    project: 'antalyser-form',
                    ...payload.args
                }
            };

            delete logging.error;

            sendError(error, {
                user_id: userId,
                account_id: accountId,
                token,
                trace_id: traceId,
                ...logging
            });
        }

    } catch (e) {
        // Error
    }
}

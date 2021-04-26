export const types = {
    MONITOR_INIT: 'Modules/Monitor/MONITOR_INIT',
    MONITOR_LOG: 'Modules/Monitor/MONITOR_LOG'
};

/* Action creator */
export function monitorInit() {
    return {type: types.MONITOR_INIT};
}

export function monitorLog(payload) {
    return {type: types.MONITOR_LOG, payload};
}

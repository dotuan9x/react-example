export const types = {
    UPDATE_LOGIN: 'Layouts/containers/Login/UPDATE_LOGIN'
};

export function updateLogin(payload) {
    return {type: types.UPDATE_LOGIN, payload};
}

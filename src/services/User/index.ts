import {services} from 'Src/services/services';
import {appConfig} from 'Src/constant';

export function get(params) {
    return services.get({...params, API_HOST: appConfig.API_HOST + 'user/index'});
}

export function getList(params) {
    return services.getList({...params, API_HOST: appConfig.API_HOST + 'user/index'});
}

export function create(params) {
    return services.create({...params, API_HOST: appConfig.API_HOST + 'user/index'});
}

export function update(params) {
    return services.update({...params, API_HOST: appConfig.API_HOST + 'user/index'});
}

export function del(params) {
    return services.del({...params, API_HOST: appConfig.API_HOST + 'user/index'});
}
import moment from 'moment';
import routes from 'Src/routes';
import {matchPath} from 'react-router-dom';
import {handleError} from 'Src/handleError';
import {appConfig} from 'Src/constant';
import localforage from 'localforage';
import {set} from 'lodash';

const PATH = 'Src/utils.js';

export const checkJSON = (_str) => {
    try {
        let result = true;

        try {
            JSON.parse(_str);
        } catch (e) {
            result = false;
        }

        return result;
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'checkJSON',
            args: {
                _str
            }
        });
    }
};

export const checkURL = (url) => {
    try {
        let result = true;

        try {
            new URL(url);
        } catch (e) {
            result = false;
        }

        return result;
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'checkURL',
            args: {
                url
            }
        });
    }
};

export const formatUserId = (userId) => {
    try {
        userId = getObjectPropSafely(() => userId.toString()) || '';

        if (!userId || !userId.length) {
            return '';
        } else {
            userId = userId.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
            return userId;
        }
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'formatUserId',
            args: {
                userId
            }
        });
    }
};

export const setCookie = (name, value, exdays, domain) => {
    try {
        const {protocol = 'https:'} = getObjectPropSafely(() => window.location) || {};

        let d = new Date();

        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);

        if (protocol === 'https:') {
            document.cookie = `${name}=${value}; Domain=${domain}; Path=/; Expires=${d.toGMTString()}; SameSite=None; Secure`;
        } else {
            document.cookie = `${name}=${value}; Domain=${domain}; Path=/; Expires=${d.toGMTString()};`;
        }

    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'setCookie',
            args: {
                name, value, exdays, domain
            }
        });
    }
};

export const getCookie = (cname) => {
    try {
        let name = cname + '=';
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');

        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];

            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }

        return '';
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'getCookie',
            args: {
                cname
            }
        });
    }
};

export const random = (number) => {
    try {
        let text = '';
        let possible = 'abcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < number; i++) {text += possible.charAt(Math.floor(Math.random() * possible.length))}

        return text;
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'random',
            args: {
                number
            }
        });
    }
};

export const uuidv4 = () => {
    try {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);

            return v.toString(16);
        });
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'uuidv4',
            args: {}
        });
    }
};

export const getMatchFromPath = (path) => {
    try {
        // path: /1210044026/report/my-report-template

        let result = null;

        routes.forEach(function(route) {
            const match = matchPath(path, {
                path: route.path,
                exact: true,
                strict: false
            });

            if (match && match.params && match.path && route.state) {
                result = {
                    ...match,
                    showBreadcrumb: route.showBreadcrumb,
                    showLeftMenu: route.showLeftMenu,
                    breadcrumbShowOnlyTitle: route.breadcrumbShowOnlyTitle,
                    state: route.state
                };

                return result;
            }
        });

        return result;
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'getMatchFromPath',
            args: {
                path
            }
        });
    }
};

export const getLinkFromState = (state, params) => {
    try {
        let url = '';

        if (state && params) {
            routes.map((route) => {
                if (route.state && route.state === state) {
                    let path = route.path;

                    Object.keys(params).map((param) => {
                        path = path.split(`:${param}`).join(params[param]);
                    });

                    url = path;
                }
            });
        }

        return url;
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'getLinkFromState',
            args: {
                state, params
            }
        });
    }
};

export const formatKeyToSnake = (data) => {
    try {
        let result = {};

        if (data && typeof data === 'object') {
            result = Object.entries(data).reduce((obj, [key, value]) => {
                return {...obj, [camelToSnake(key)]: value};
            }, {});
        } else if (data && Array.isArray(data)) {
            result = data.map((item) => {
                return formatKeyToSnake(item);
            });
        }

        return result;
    } catch (error) {
        handleError(error, {
            path: PATH,
            action: 'formatKeyToSnake',
            args: {}
        });
    }
};

export const formatFilter = (componentFilters = [], schemas = []) => {
    try {
        let formattedFilter = [];

        componentFilters.map(componentFilter => {
            const filters = componentFilter.filter_value || componentFilter.filterValue || [];

            if (filters.length) {
                filters.map(filter => {
                    let orRow = [];

                    if (filter.length) {
                        filter.map(element => {
                            const {field_name = {}, operator = {}} = element;
                            const {name: fieldName = ''} = field_name;
                            const {name: operatorName = ''} = operator;
                            let value = getObjectPropSafely(() => element.value);

                            // When semanticType is PERCENT we need to transform data, divided by 100
                            const fieldInSchemas = getObjectPropSafely(() => {
                                return schemas.find(field => field.name === fieldName);
                            });

                            if (fieldInSchemas) {
                                const semanticType = getObjectPropSafely(() => fieldInSchemas.semantics.semanticType);

                                if (semanticType === 'PERCENT') {
                                    value = getObjectPropSafely(() => parseFloat(value) / 100);
                                }
                            }

                            if (fieldName && operatorName && value) {
                                if (value && Array.isArray(value)) {
                                    const objOne = value.find(item => item.key === 'fromDate');
                                    const objTwo = value.find(item => item.key === 'toDate');

                                    const fromDate = objOne && objOne.date && objOne.date.split('/').reverse().join('');
                                    const toDate =  objTwo && objTwo.date && objTwo.date.split('/').reverse().join('');

                                    fromDate && toDate && orRow.push({[fieldName]: {[operatorName === 'between' ? 'on' : operatorName]: [fromDate, toDate]}});

                                } else if (Object.entries(value).length) {
                                    const fromDate = value && value.date && value.date.split('/').reverse().join('');

                                    fromDate && orRow.push({[fieldName]: {[operatorName === 'between' ? 'on' : operatorName]: fromDate}});
                                } else {
                                    orRow.push({[fieldName]: {[operatorName === 'between' ? 'on' : operatorName]: value}});
                                }

                            }

                            if (fieldName && operatorName && (operatorName === 'is_null' || operatorName === 'is_not_null')) {
                                orRow.push({[fieldName]: {[operatorName]: ''}});
                            }
                        });
                    }

                    formattedFilter.push(orRow);
                });
            }
        });
        return formattedFilter;
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'formatFilter',
            args: {
                componentFilters
            }
        });
    }
};

export const degreesToRadians = (degrees) => {
    try {
        return degrees * (Math.PI / 180);
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'degreesToRadians',
            args: {
                degrees
            }
        });
    }
};

// Cache result of original function when arguments not change
export const memoization = (func) => {
    try {
        const cache = {};

        const result = (args) => {
            const stringifiedArgs = JSON.stringify(args);

            cache[stringifiedArgs] = typeof cache[stringifiedArgs] !== 'undefined' ?
                cache[stringifiedArgs] : func(args);

            return cache[stringifiedArgs];
        };

        return result;
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'memoization',
            args: {
                func
            }
        });
    }
};

export const getSizeOfText = (str = 'A', fontSize = '12px', fontFamily = 'roboto') => {
    try {
        let node = document.createElement('div');
        let textNode = document.createTextNode(str);

        node.id = 'text-size';
        node.appendChild(textNode);
        document.getElementById('root').appendChild(node);

        node.style.fontSize = fontSize;
        node.style.fontFamily = fontFamily;
        let height = (node.clientHeight + 1);
        let width = (node.clientWidth + 1);

        node.remove();
        return {height, width};
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'getSizeOfText',
            args: {
                str, fontSize, fontFamily
            }
        });
    }
};

export const getWidthOfText = (str, fontSize, fontFamily) => {
    try {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        context.font = `${fontSize} ${fontFamily}`;
        return context.measureText(str).width;
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'getWidthOfText',
            args: {
                str, fontSize, fontFamily
            }
        });
    }
};

export const getMaxLetter = ({str = '', strLength, fontSize, fontFamily, maxWidth}) => {
    try {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        let width = '';

        const length = (str + '').length;

        if (length) {
            let newString = '';

            if (length === strLength) {
                context.font = `${fontSize.name} ${fontFamily.label}`;
                width = context.measureText(str).width;
                newString = str;
            } else if (length >= 0) {
                context.font = `${fontSize.name} ${fontFamily.label}`;

                width = context.measureText(`${str}...`).width;
                newString = `${str}...`;
            } else {
                return '';
            }

            if (width < maxWidth) {
                return newString;
            } else {
                return getMaxLetter({str: str.toString().substring(0, length - 1), maxWidth, strLength, fontSize, fontFamily});
            }
        } else {
            width = context.measureText('...').width;

            if (width < maxWidth) {
                return '...';
            } else {
                return '';
            }
        }
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'getMaxLetter',
            args: {
                str, strLength, fontSize, fontFamily, maxWidth
            }
        });
    }
};

/***
 * Round target number to the closest provided number
 * @example roundNumberBy(1)(0.4) -> 1
 * @example roundNumberBy(120)(140) -> 120
 * @param by
 * @returns {Function}
 */
export const roundNumberBy = (by = 10) => (value) => {
    try {
        if (value > 0 && value <= 1) {
            return 1;
        }

        return Math.round(Math.round(value / by) * by);
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'roundNumberBy',
            args: {
                by, value
            }
        });
    }
};
/***
 * Find the base when divide for 10
 * @example findBaseDivisorBy10(6) -> 6
 * @example findBaseDivisorBy10(14) -> 10
 * @example findBaseDivisorBy10(130) -> 100
 * @example findBaseDivisorBy10(2400) -> 1000
 * @param value
 * @returns {number|*}
 */
export const findBaseDivisorBy10 = (value) => {
    try {
        for (let coefficient = 0; coefficient < 9; coefficient++) {
            if ((value / (10 ** coefficient)) < 10) {
                if (coefficient === 0) {
                    // float is rounded by 1
                    if (value % Math.floor(value) !== 0) {
                        return roundNumberBy(1)(value);
                    }

                    return value;
                }

                return 10 ** coefficient;
            }
        }

        return 10;
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'findBaseDivisorBy10',
            args: {
                value
            }
        });
    }
};

/***
 * Use for Array.prototype.reduce()
 * if array element is Object then it takes key to sum
 * else if array element is array then it recursively sum by key
 * else if array element is number then sum elements
 * @param objectKey
 * @returns {Function}
 */
export const sumByObjectKey = (objectKey) => (total, current) => {
    try {
        if (typeof current === 'number') {
            return total + current;
        }

        if (typeof current === 'object') {
            if (current.length) {
                return total + current.reduce(sumByObjectKey(objectKey), 0);
            }

            if (typeof current[objectKey] === 'number') {
                return total + current[objectKey];
            }
        }

        return total;
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'sumByObjectKey',
            args: {
                objectKey, total, current
            }
        });
    }
};

export function formatNumber(value) {
    try {
        let formattedValue = 0;

        if (value) {
            formattedValue = Intl.NumberFormat('en').format(value);
        }

        return formattedValue;
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'formatNumber',
            args: {
                value
            }
        });
    }
}

export const getLocalStorage = async (key) => {
    try {
        if (key) {
            let cache = await localforage.getItem(`${appConfig.LOCAL_STORAGE_PREFIX}:networkId:${appConfig.API_ID}:${key}`);

            if (cache) {
                cache = JSON.parse(cache);

                if (cache.time && cache.data) {
                    let now = moment.now();

                    let secondDiff = moment(now).diff(moment(cache.time), 'seconds');

                    return {
                        seconds: secondDiff,
                        data: cache.data
                    };
                } else {
                    deleteLocalStorage(`${appConfig.LOCAL_STORAGE_PREFIX}:${key}`);
                }
            }
        }

        return false;
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'getLocalStorage',
            args: {
                key
            }
        });
    }
};

export const setLocalStorage = (key, value) => {
    try {
        if (typeof key === 'string' && typeof value === 'string') {
            localforage.setItem(`${appConfig.LOCAL_STORAGE_PREFIX}:networkId:${appConfig.API_ID}:${key}`, value);
        }
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'setLocalStorage',
            args: {
                key, value
            }
        });
    }
};

export const deleteLocalStorage = (key) => {
    try {
        if (typeof key === 'string') {
            localforage.removeItem(`${appConfig.LOCAL_STORAGE_PREFIX}:networkId:${appConfig.API_ID}:${key}`);
        }
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'deleteLocalStorage',
            args: {
                key
            }
        });
    }
};

export const isEmail = (email) => {
    try {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return re.test(String(email).toLowerCase());
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'isEmail',
            args: {
                email
            }
        });
    }
};

export const convertQueryStringToObject = (url) => {
    try {
        const arr = url.slice(1).split(/&|=/);
        let params = {};

        for (let i = 0; i < arr.length; i += 2) {
            const key = arr[i], value = arr[i + 1];

            params[key] = value;
        }
        return params;
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'convertQueryStringToObject',
            args: {
                url
            }
        });
    }
};

/***
 * Get a property of object safely
 * @param fn: function that gets object property
 * @param defaultValue: default value if something wrong
 * @example
 *  getSafe(() => a.b.c.d, 'someValue') => d
 *  getSafe(() => a.b[undefined].c.d, 'someValue') => 'someValue'
 * @returns {string|*}
 */
export const getObjectPropSafely = (fn, defaultValue = '') => {
    try {
        return fn();
    } catch (e) {
        return defaultValue;
    }
};

export const getStyle = (elementId, styleName) => {
    try {
        const element = document.getElementById(elementId);
        let style = '';

        if (element) {
            if (element.currentStyle) {
                style = element.currentStyle[styleName];
            } else if (window.getComputedStyle) {
                style = document.defaultView.getComputedStyle(element, null).getPropertyValue(styleName);
            }
        }

        return style;
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'getStyle',
            args: {
                elementId, styleName
            }
        });
    }
};

export const dateFormatPatternByLang = {
    en: 'MMM DD, YYYY',
    vi: 'DD MMMM, YYYY'
};

export const dateTimeFormatPatternByLang = {
    en: 'MMM DD, YYYY HH:mm:ss',
    vi: 'DD MMMM, YYYY HH:mm:ss'
};

export const capitalizeFirstLetter = (str) => {
    try {
        return str.charAt(0).toUpperCase() + str.slice(1);
    } catch (error) {
        handleError(error, {
            component: PATH,
            action: 'capitalizeFirstLetter',
            args: {
                str
            }
        });
    }
};

export const removeAccent = (str) => {
    try {
        str = str.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a');
        str = str.replace(/[èéẹẻẽêềếệểễ]/g, 'e');
        str = str.replace(/[ìíịỉĩ]/g, 'i');
        str = str.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o');
        str = str.replace(/[ùúụủũưừứựửữ]/g, 'u');
        str = str.replace(/[ỳýỵỷỹ]/g, 'y');
        str = str.replace(/đ/g, 'd');
        str = str.replace(/[ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ]/g, 'A');
        str = str.replace(/[ÈÉẸẺẼÊỀẾỆỂỄ]/g, 'E');
        str = str.replace(/[ÌÍỊỈĨ]/g, 'I');
        str = str.replace(/[ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ]/g, 'O');
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
        str = str.replace(/Đ/g, 'D');
        return str;
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'removeAccent',
            args: {
                str
            }
        });
    }
};

export const changeSpecialCharacterToSnake = (str) => {
    try {
        // E.g: "Thinh dN-P" => "thinh_dn_p"
        str = removeAccent(str).replace(/[^a-zA-Z0-9]/g, '_');
        return str.toString().toLocaleLowerCase();
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'changeSpecialCharacterToSnake',
            args: {
                str
            }
        });
    }
};

export function locateComponentOnMobile({id, components, pageId, width = 330}) {
    try {
        let height = 0,
            left = 10,
            top = 10;
        const componentsInPage = components.filter(
            component => component.pageId === pageId
        );

        for (let i = 0, length = componentsInPage.length; i < length; i++) {
            let component = componentsInPage[i];
            let heightComponent = 0;

            if (component.width < 330) {
                heightComponent = component.height;
            } else {
                heightComponent = component.height * (width / component.width);
            }

            if (component.id === id) {
                if (component.width < 330) {
                    width = component.width;
                    height = component.height;
                } else {
                    height = component.height * (width / component.width);
                }
                break;
            }

            top = top + heightComponent + 10;
        }

        return {height, width, left, top};
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'locateComponentOnMobile',
            args: {}
        });
    }
}

export const formatTimePicker = (timeToFormat, typeOfFormat) => {
    try {
        let year = '';
        let quarter = '';
        let month = '';
        let day = '';
        let hour = '';

        switch (typeOfFormat) {
            case 'YEAR_QUARTER':
                const yearQuarter = timeToFormat.toString();

                year = yearQuarter.slice(0,4);
                quarter = yearQuarter.slice(4);
                break;
            case 'DATE_HOUR':
                const dateHour = timeToFormat.toString();

                year = dateHour.slice(0,4);
                month = dateHour.slice(4,6);
                day = dateHour.slice(6,8);
                hour = dateHour.slice(8);
                break;
            case 'DATE':
                const date = timeToFormat.toString();

                year = date.slice(0,4);
                month = date.slice(4,6);
                day = date.slice(6);
                break;
            default:
                break;
        }

        return {year,quarter,month,day,hour};
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'locateComponentOnMobile',
            args: {
                timeToFormat, typeOfFormat
            }
        });
    }
};

export const popupWindow = (url, title, w = 600, h = 800) => {
    try {
        let left = (screen.width / 2) - (w / 2);
        let top = (screen.height / 2) - (h / 2);

        return window.open(url, title,
            'toolbar=yes, location=no, directories=no, status=yes,' +
            ' menubar=no, scrollbars=yes, resizable=yes,' +
            ' width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
    } catch (error) {
        handleError(error, {
            component: PATH,
            action: 'popupwindow',
            args: {}
        });
    }
};

export function detectMobileBrowser() {
    try {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(navigator.userAgent || navigator.vendor || window.opera) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test((navigator.userAgent || navigator.vendor || window.opera).substr(0, 4))) {return true}
        return false;
    } catch (error) {
        handleError(error, {
            component: PATH,
            action: 'detectMobileBrowser',
            args: {}
        });
    }
}

export function getUpdatedOffsetForIndex({
    align = 'auto',
    cellOffset,
    cellSize,
    containerSize,
    currentOffset
}) {
    try {
        const maxOffset = cellOffset;
        const minOffset = maxOffset - containerSize + cellSize;

        switch (align) {
            case 'start':
                return maxOffset;
            case 'end':
                return minOffset;
            case 'center':
                return maxOffset - (containerSize - cellSize) / 2;
            default:
                return Math.max(minOffset, Math.min(maxOffset, currentOffset));
        }
    } catch (error) {
        handleError(error, {
            component: PATH,
            action: 'getUpdatedOffsetForIndex',
            args: {align,
                cellOffset,
                cellSize,
                containerSize,
                currentOffset}
        });
    }
}

export function createCallbackMemoizer(requireAllKeys = true) {
    try {
        let cachedIndices = {};

        const memorizer = ({callback, indices}) => {
            const keys = Object.keys(indices);
            const allInitialized =
                !requireAllKeys ||
                keys.every(key => {
                    const value = indices[key];

                    return Array.isArray(value) ? value.length > 0 : value >= 0;
                });
            const indexChanged =
                keys.length !== Object.keys(cachedIndices).length ||
                keys.some(key => {
                    const cachedValue = cachedIndices[key];
                    const value = indices[key];

                    return Array.isArray(value)
                        ? cachedValue.join(',') !== value.join(',')
                        : cachedValue !== value;
                });

            cachedIndices = indices;

            if (allInitialized && indexChanged) {
                callback(indices);
            }
        };

        return memorizer;
    } catch (error) {
        handleError(error, {
            component: PATH,
            action: 'createCallbackMemoizer',
            args: {requireAllKeys}
        });
    }
}

export const getParamsFromState = (state) => {
    try {
        let params = [];
        let paramIdentificationMark = ':';
        let paramIdentificationPosition = 0;

        if (state) {
            routes.map((route) => {
                if (route.state && route.state === state) {
                    let path = route.path;

                    path = path.split('/');

                    path.map((pathItem) => {
                        if (pathItem.indexOf(paramIdentificationMark) === paramIdentificationPosition) {
                            pathItem = pathItem.split(':');
                            pathItem.shift();

                            params.push(pathItem);
                        }
                    });
                }
            });
        }

        return params;
    } catch (error) {
        handleError(error, {
            component: PATH,
            action: 'getParamsFromState',
            args: {
                state
            }
        });
    }
};

/**
 * Add a prop to an object without mutating it
 * @example
 * addProp({checked: true})({id: 1}) = {id: 1, checked: true}
 *
 * Use with Array.prototype.map
 * @example
 * [{id: 1}].map(addProp({checked: true})) = [{id: 1, checked: true}]
 *
 * @param {object} prop - prop to add
 */
export const addProp = prop => to => ({...to, ...prop});

/**
 * Remove prop(s) without mutate the object
 * @example
 * removeProp('name')({id: 1, name: 'Thao'}) = {id: 1}
 *
 * Use with Array.prototype.map
 * @example
 * [{id: 1}].map(remove('id')) = [{}]
 */
export const removeProp = (name) => obj => {
    if (Array.isArray(name)) {
        return name.reduce((res, n) => removeProp(n)(res), obj);
    }

    if (typeof name !== 'string' && !name) {return obj}

    let {[name]: removed, ...res} = obj || {};

    return res;
};

/**
 * Pick props from an object
 * @example
 * pickProps(['name'])({id: 1, name: 'Thao'}) = {name: 'Thao'}
 *
 * Use with Array.prototype.map
 * @example
 * [{id: 1, name: 'Thao'}].map(pickProps('id')) = [{id: 1}]
 */
export const pickProps = (...names) => obj => Object.fromEntries(names.flat().map(key => [key, obj[key]]));

/**
 * Pick props (that not in params) from an object
 *
 * Oposite with @see pickProps
 * @example
 * pullProps(['name'])({id: 1, name: 'Thao'}) = {id: 1}
 *
 * Use with Array.prototype.map
 * @example
 * [{id: 1, name: 'Thao'}].map(pullProps('id')) = [{name: 'Thao'}]
 */
export const pullProps = (...names) => obj => Object.fromEntries(Object.entries(obj).filter(([k]) => !names.flat().includes(k)));

export const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Combines n functions. It’s a pipe flowing left-to-right, calling each function with the output of the last one.
 * @example
 * pipe(
 *  getName,
 *  uppercase,
 *  get6Characters,
 *  reverse
 * )({ name: 'Buckethead' }) === reverse(get6Characters(uppercase(getName({ name: 'Buckethead' }))));
 * @param  {...Function} fns
 */
export const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x);

/**
 * Combines n functions. It’s a pipe flowing right-to-left, calling each function with the output of the last one.
 * @example
 * pipe(
 * reverse,
 * get6Characters,
 * uppercase,
 * getName
 * )({ name: 'Buckethead' }) === reverse(get6Characters(uppercase(getName({ name: 'Buckethead' }))));
 * @param  {...Function} fns
 */
export const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);

export const noop = () => {};
export const returnEmptyObj = () => ({});

// Check if value is undefined
export const isUndefined = v => v === undefined;

// Check if value is null
export const isNull = v => typeof v === 'object' && v === null;

// Check if value is a function
export const isFunction = v => typeof v === 'function';

/**
 * Take n functions to make their execution results AND with each others
 * @param  {...Function} ops
 *
 * @example
 * const isNotUndefined = v => v !== undefined;
 * const isObject = v => typeof v === 'object';
 * and(isNotUndefined, isObject)({'asd': true})) = true
 */
export const and = (...ops) => (...args) => ops.reduce((a, b) => a && b(...args), true);

/**
 * Take n functions to make their execution results OR with each others
 * @param  {...Function} ops
 *
 * @example
 * or(isUndefined, isNull)({'asd': true})) = false
 * or(isUndefined, isNull)(null)) = true
 * or(isUndefined, isNull)(undefined)) = true
 */
export const or = (...ops) => (...args) => ops.reduce((a, b) => a || b(...args), false);

/**
 * If @param obj is undefined then return @param alt
 * @param {any} obj
 * @param {any} alt
 *
 * @example
 * otherwise(21, 23) = 21;
 * otherwise(undefined, 123) = 123;
 */
export const otherwise = (obj, alt) => isUndefined(obj) ? alt : obj;

export const immutableSet = (obj, key, value) => set({...obj}, key, value);

/**
 * Execute the function with each value
 * @param {Function} fn
 * @example
 * executeWithSpreadedArray((v) => v*2)(1, 2) = [2, 4]
 */
export const executeWithSpreadedArray = fn => (...arr) => arr.map(fn);

/**
 * Expose two functions
 *
 * `.keys`: Execute the function with each key of object
 *
 * `.values`: Execute the function with each value in object
 *
 * @example
 * executeWithObject.keys((v) => v + v)({a: 1, b: 2}) = {a: 'aa', b: 'bb'}
 *
 * @example
 * executeWithObject.values((v) => v*2)({a: 1, b: 2}) = {a: 2, b: 4}
 */
export const executeWithObject = (() => {
    const withKey = fn => ([k, _]) => fn(k);
    const withVal = fn => ([_, v]) => fn(v);
    const withEntry = fn => ([k, v]) => fn([k, v]);
    const toEntry = fn => ([k, v]) => [k, fn([k, v])];

    const execute = hof => fn => obj =>
        Object.fromEntries(Object.entries(obj).map(toEntry(hof(fn))));

    return {
        keys: execute(withKey),
        values: execute(withVal),
        entries: execute(withEntry)
    };
})();

export const isEmpty = obj => !Object.keys(obj).length;

// Helper to create partially applied functions
// Takes a function and some arguments
export const partial = (f, ...args) =>
// returns a function that takes the rest of the arguments
    (...moreArgs) =>
    // and calls the original function with all of them
        f(...args, ...moreArgs);

// Helper clone Object with key has data Type !== Date , function
export function cloneObject(obj) {
    let clone = {};

    for (let index in obj) {
        if (obj[index] != null &&  typeof(obj[index]) == 'object')
        {clone[index] = cloneObject(obj[index])}
        else
        {clone[index] = obj[index]}
    }

    if (Array.isArray(obj)) {
        return Object.values(obj);
    }

    return clone;
}

export const getOffset = ( el ) => {
    var _x = 0;
    var _y = 0;

    while ( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return {top: _y, left: _x};
};

export function snakeToCamel(string) {
    return string.replace(/(_\w)/g, function(m) {
        return m[1].toUpperCase();
    });
}

export function camelToSnake(string) {
    return string.replace(/[\w]([A-Z])/g, function(m) {
        return m[0] + '_' + m[1];
    }).toLowerCase();
}

export const getObjectExistValue = (obj) => {
    return Object.entries(obj).reduce((total, [key, value]) => {
        if (value) {
            return {...total, [key]: value};
        }
        return total;
    }, {});
};

export const loadingElm = () => {
    const show = () => {
        const rootElm = document.getElementById('root');

        if (rootElm) {
            const styles = {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
            };
            const loading = rootElm.appendChild(document.createElement('div'));

            Object.entries(styles).forEach(([key, value]) => {
                loading.style[key] = value;
            });

            loading.id = 'loading';
            const loader = loading.appendChild(document.createElement('div'));

            loader.classList.add('loader-medium');

            const text = loading.appendChild(document.createElement('span'));

            text.style.marginLeft = '-23px';
            text.innerHTML = 'Loading...';
        }
    };

    const hide = () => {
        const loading = document.getElementById('loading');

        if (loading) {
            loading.remove();
        }
    };

    return {
        show, hide
    };
};

export const setNetworkTheme = () => {
    try {
        let theme = appConfig.THEME || '';

        document.documentElement.setAttribute('theme', theme);
    } catch (error) {
        handleError(error, {
            path: PATH,
            name: 'setNetworkTheme',
            args: {}
        });
    }
};

export const getDateRangeDimensionFields = (fields) => {
    try {
        return fields.filter(field => {
            return (getObjectPropSafely(() => field.dataType === 'DATE', false)
               && getObjectPropSafely(() => appConfig.ALLOW_DATE_RANGE_DIMENSION_TYPE.some(date =>
               {return date.type === field.semantics.semanticType}
               ))
            );
        });
    } catch (error) {
        handleError(error, {
            component: PATH,
            action: 'getDateRangeDimensionFields',
            args: {fields}
        });

        return fields;
    }
};

export function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

export const filterObjectByKeys = (object, allowedKeys) => {
    try {
        if (allowedKeys && Array.isArray(allowedKeys)) {
            return allowedKeys.reduce((acc, key) => {
                if (object[key] !== undefined) {
                    acc[key] = object[key];
                }
                return acc;
            }, {});
        } else {
            return object;
        }
    } catch (error) {
        handleError(error, {
            component: PATH,
            action: 'filterObjectByKeys',
            args: {object, allowedKeys}
        });

        return object;
    }
};

export const deepDiffMapper = function () {
    return {
        VALUE_CREATED: 'created',
        VALUE_UPDATED: 'updated',
        VALUE_DELETED: 'deleted',
        VALUE_UNCHANGED: 'unchanged',
        map: function(obj1, obj2) {
            if (this.isFunction(obj1) || this.isFunction(obj2)) {
                throw 'Invalid argument. Function given, object expected.';
            }
            if (this.isValue(obj1) || this.isValue(obj2)) {
                return {
                    type: this.compareValues(obj1, obj2),
                    data: obj1 === undefined ? obj2 : obj1
                };
            }

            let diff = {};

            for (let key in obj1) {
                if (this.isFunction(obj1[key])) {
                    continue;
                }

                let value2 = undefined;

                if (obj2[key] !== undefined) {
                    value2 = obj2[key];
                }

                diff[key] = this.map(obj1[key], value2);
            }
            for (let key in obj2) {
                if (this.isFunction(obj2[key]) || diff[key] !== undefined) {
                    continue;
                }

                diff[key] = this.map(undefined, obj2[key]);
            }

            return diff;

        },
        compareValues: function (value1, value2) {
            if (value1 === value2) {
                return this.VALUE_UNCHANGED;
            }
            if (this.isDate(value1) && this.isDate(value2) && value1.getTime() === value2.getTime()) {
                return this.VALUE_UNCHANGED;
            }
            if (value1 === undefined) {
                return this.VALUE_CREATED;
            }
            if (value2 === undefined) {
                return this.VALUE_DELETED;
            }
            return this.VALUE_UPDATED;
        },
        isFunction: function (x) {
            return Object.prototype.toString.call(x) === '[object Function]';
        },
        isArray: function (x) {
            return Object.prototype.toString.call(x) === '[object Array]';
        },
        isDate: function (x) {
            return Object.prototype.toString.call(x) === '[object Date]';
        },
        isObject: function (x) {
            return Object.prototype.toString.call(x) === '[object Object]';
        },
        isValue: function (x) {
            return !this.isObject(x) && !this.isArray(x);
        }
    };
};

export function memoize(func, resolver) {
    if (typeof func !== 'function' || (resolver != null && typeof resolver !== 'function')) {
        throw new TypeError('Expected a function');
    }
    const memoized = function(...args) {
        const key = resolver ? resolver.apply(this, args) : args;
        const cache = memoized.cache;

        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = func.apply(this, args);

        memoized.cache = cache.set(key, result) || cache;
        return result;
    };

    memoized.cache = new (memoize.Cache || Map);
    return memoized;
}

memoize.Cache = Map;

export const getDayBySemanticType = (time, semanticType) => {
    if (time <= 0) {
        return 1;
    }

    switch (semanticType) {
        case 'YEAR': {
            return time * 365;
        }
        case 'YEAR_QUARTER': {
            return time * 90;
        }
        case 'YEAR_MONTH': {
            return time * 30;
        }
        case 'YEAR_WEEK': {
            return time * 7;
        }
        case 'YEAR_MONTH_DAY': {
            return time * 1;
        }
        case 'YEAR_MONTH_DAY_HOUR': {
            return time / 24;
        }
        case 'YEAR_MONTH_DAY_SECOND': {
            return time / 86400;
        }
        case 'QUARTER': {
            return time * 90;
        }
        case 'MONTH': {
            return time * 30;
        }
        case 'WEEK': {
            return time * 7;
        }
        case 'MONTH_DAY': {
            return time * 1;
        }
        case 'DAY_OF_WEEK': {
            return time * 1;
        }
        case 'DAY': {
            return time * 1;
        }
        case 'HOUR': {
            return time / 24;
        }
        case 'MINUTE': {
            return time / 60;
        }
        default:
            return time;
    }
};
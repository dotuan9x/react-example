// For CSS
declare module "*.module.css" {
    const classes: { [key: string]: string };
    export default classes;
}

// For LESS
declare module "*.module.less" {
    const classes: { [key: string]: string };
    export default classes;
}

declare module "*.less" {
    const classes: { [key: string]: string };
    export default classes;
}

// For SCSS
declare module "*.module.scss" {
    const classes: { [key: string]: string };
    export default classes;
}

// Constant
declare var API_HOST: string;
declare var API_HOST_V3: string;
declare var ADX_SITE_URL: string;
declare var ADX_API_HOST: string;
declare var ADX_API_HOST_V3: string;
declare var PACKAGE_API_HOST: string;
declare var API_LOGGING: string;
declare var API_LOGGING_ERROR: string;
declare var LANGUAGE: string;
declare var ST_VERSION: string;
declare var MONITOR_PID: string;
declare var SITE_URL: string;
declare var HELPHERO_APP_ID: string;
declare var LOGO_MAIN: string;
declare var LOGO_SUB: string;
declare var ASSETS_URL: string;
declare var API_ID: string;
declare var PROJECT_ID: string;
declare var U_OGS: string;
declare var AUTH_ADX_DOMAIN: string;
declare var ST_OGS: string;
declare var ST_URL_UPLOAD: string;
declare var APPLICATION_ENV: string;
declare var ANTALYSER_MODULE: string;
declare var DEVICE: string;
declare var IS_IFRAME: string;
declare var THEME: string;
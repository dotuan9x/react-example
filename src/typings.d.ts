// For CSS
declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

// For SCSS
declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
}

declare let DEVICE: string;
declare let THEME: string;

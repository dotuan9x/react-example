export const checkJSON = (_str: string) => {
    try {
        let result = true;

        try {
            JSON.parse(_str);
        } catch (e) {
            result = false;
        }

        return result;
    } catch (error) {
        return  _str;
    }
};

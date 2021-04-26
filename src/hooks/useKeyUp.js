import {useState} from 'react';

// Assets
import {handleError} from 'Src/handleError';

const PATH = 'Src/hooks/useKeyUp.jsx';

export default () => {
    try {
        const [keyCode, handleChangeKeyCode] = useState(null);

        return {
            keyCode,
            onChangeKeyUp: (event) => {
                handleChangeKeyCode(event.keyCode);
            },
            setDefaultKeyUp: () => {handleChangeKeyCode(null)}
        };
    } catch (e) {
        handleError(e, {
            component: PATH,
            action: 'useKeyUp',
            args: {}
        });
    }
};

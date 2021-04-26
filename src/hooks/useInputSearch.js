import {useState} from 'react';

// Assets
import {handleError} from 'Src/handleError';

const PATH = 'Src/hooks/useInputName.jsx';

export default () => {
    try {
        const [searchValue, setSearchValue] = useState('');

        return {
            searchValue,
            onChangeSearchValue: (event) => {
                setSearchValue(event.target.value);
            },
            resetSearchValue: () => setSearchValue('')
        };
    } catch (e) {
        handleError(e, {
            component: PATH,
            action: 'useInputName',
            args: {}
        });
    }
};

// Libraries
import React from 'react';
import {withRouter} from 'react-router-dom';

// Components
import Resizeable from 'Src/examples/resizeable';

const Layouts = () => {
    return (
        <div className="flex flex-col">
            <Resizeable />
        </div>
    );
};

export default withRouter(Layouts);


// Libraries
import React from 'react';
import {withRouter} from 'react-router-dom';

// Components
import DefaultMain from 'Modules/Layouts/containers/DefaultMain';

const Layouts = () => {
    return (
        <div>
            <DefaultMain />
        </div>
    );
};

export default withRouter(Layouts);


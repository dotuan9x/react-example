// Libraries
import React from 'react';
import {withRouter} from 'react-router-dom';

// Assets
import 'bootstrap/dist/css/bootstrap.min.css';
import 'Assets/scss/layout.scss';
import '@antscorp/components/main.css';

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


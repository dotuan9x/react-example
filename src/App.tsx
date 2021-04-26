// Libraries
import React from 'react';
import {Provider} from 'react-redux';
import {HashRouter as Router, Switch, Route} from 'react-router-dom';

// Store Redux
import store from './store';

// Components
import Layouts from 'Modules/Layouts';

const App = () => {
    return (
        <Provider store={store}>
            <Router>
                <Switch>
                    <Route path="/" component={Layouts} />
                </Switch>
            </Router>
        </Provider>
    );
};

export default App;

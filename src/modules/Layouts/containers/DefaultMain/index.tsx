// Libraries
import React, {Suspense} from 'react';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';

// Components
import DefaultHeader from 'Modules/Layouts/containers/DefaultHeader';

// Styled
import {DefaultMainStyled} from './styled';

// Assets
import routes from 'Src/routes';

const DefaultMain = () => {
    return (
        <React.Fragment>
            <DefaultHeader />
            <DefaultMainStyled >
                <Suspense fallback={<div>Loading</div>}>
                    <Switch>
                        {routes.map((route, idx) => {
                            return route.component ? (
                                <Route key={idx} path={route.path} exact={route.exact} render={props => (
                                    <route.component {...props} />
                                )} />) : null;
                        }
                        )}
                        <Redirect to={'/form'} />
                    </Switch>
                </Suspense>
            </DefaultMainStyled>
        </React.Fragment>
    );
};

export default withRouter(DefaultMain);

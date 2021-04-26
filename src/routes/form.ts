import React from 'react';

const Form = React.lazy(() => import('Modules/Form'));

export default [
    {
        state: 'form',
        path: '/form',
        exact: true,
        component: Form,
        resources: [
            
        ]
    }
];
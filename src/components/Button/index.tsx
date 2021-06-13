// Libraries
import React from 'react';

export interface ButtonProps {
    /**
     * Chart wrap width
     */
    width?: number,
    /**
     * Chart wrap height
     */
    height ?: number,
}

/* const defaultProps = {
    width: 804,
    height: 150
}; */

/**
 * Line chart component customize use d3.js
 */
export const Button: React.FunctionComponent<ButtonProps> = ({
    width = 100
}) => {
    return (
        <div>Hello {width}</div>
    );
};

// LineChartComponent.defaultProps = defaultProps;

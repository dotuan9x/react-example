import {useState, useEffect, useRef} from 'react';
import {reportConfig} from 'Modules/Report/components/Workspace/constant';
import usePrevious from 'Hooks/usePrevious';
import isEqual from 'react-fast-compare';

function getInitState(props) {
    const legend = {
        lineHeight: 25,
        padding: 10,
        width: 30,
        height: 30
    };
    
    let chart;

    if (props.chartBorder) {
        chart = {
            ...props.chartBorder,
            isShowAxes: true
        };
    } else {
        chart = {
            isStatic: false,
            top: reportConfig.MINIMUM_CHART_MARGIN,
            left: reportConfig.DEFAULT_AXIS_PADDING,
            isShowAxes: true
        };

        chart.width = props.width - chart.left - reportConfig.MINIMUM_CHART_MARGIN;
        chart.height = props.height - reportConfig.MINIMUM_CHART_MARGIN -
            chart.left - legend.height;
    }

    return {legend, chart};
}

export default function useChartResizer(props) {
    const [state, setState] = useState(getInitState(props));

    const previousWidth = usePrevious(props.width);
    const previousHeight = usePrevious(props.height);
    const previousCoordinateAxis = usePrevious(props.coordinateAxis);

    const legendRef = useRef(null);

    useEffect(() => {
        if (!isNaN(previousWidth)) {
            // Resize component also resize chart
            const newState = Object.assign({}, state);

            newState.chart.width = state.chart.width + (props.width - previousWidth);

            setState(newState);
        }
    }, [props.width]);

    useEffect(() => {
        if (!isEqual(state.chart, props.chartBorder)) {
            const newState = Object.assign({}, state);

            newState.chart = {
                ...state.chart,
                ...props.chartBorder
            };

            setState(newState);
        }
    }, [props.chartBorder]);

    useEffect(() => {
        if (!isNaN(previousHeight)) {
            // Resize component also resize chart
            const newState = Object.assign({}, state);

            newState.chart.height = state.chart.height + (props.height - previousHeight);

            setState(newState);
        }
    }, [props.height]);

    useEffect(() => {
        const newState = {};
        const {chart, legend} = state;
        const {isAllOnRight, isAllOnLeft = true, style = {}} = props;
        const {legend: legendStyle = {}, axes = {}} = style;

        if (!chart || !legend) {
            return;
        }

        const legendPlacement = legendStyle.placement ? legendStyle.placement : 'bottom';

        let isChangeLegendHeight = false;
        let isChangeLegendWidth = false;
        let isChangeLegendHeightWhenAuto = false;

        let newLegendHeight, newLegendWidth;

        if (legendRef && legendRef.current) {
            newLegendHeight = Math.round(legendRef.current.getBoundingClientRect().height / props.transformScale);
            newLegendWidth = Math.round(legendRef.current.getBoundingClientRect().width / props.transformScale);

            if (['top', 'bottom'].includes(legendPlacement)) {
                // Change height
                isChangeLegendHeight = newLegendHeight !== legend.height;

                if (isChangeLegendHeight) {
                    if (!newState.legend) {
                        newState.legend = {...legend};
                    }

                    newState.legend.height = newLegendHeight;

                    isChangeLegendHeightWhenAuto = !chart.isStatic;
                }
            } else if (legendPlacement === 'right') {
                isChangeLegendWidth = newLegendWidth !== legend.width;

                if (isChangeLegendWidth) {
                    if (!newState.legend) {
                        newState.legend = {...legend};
                    }

                    newState.legend.width = newLegendWidth;
                }
            }
        }

        if (!chart.isStatic) {
            const isChangeLegendPlacement = legendPlacement !== legend.placement;
            const isChangeCoordinateAxis = !isEqual(props.coordinateAxis, previousCoordinateAxis);
            const isChangeShowAxes = axes.isShowAxes !== chart.isShowAxes;

            let needCalculateChartSize =
                isChangeLegendHeightWhenAuto || isChangeCoordinateAxis ||
                isChangeLegendPlacement || isChangeShowAxes;

            if (needCalculateChartSize) {
                if (!newState.chart) {
                    newState.chart = {
                        ...chart
                    };
                }

                if (!newState.legend) {
                    newState.legend = {
                        ...legend
                    };
                }

                if (isChangeShowAxes) {
                    newState.chart.isShowAxes = axes.isShowAxes;
                }

                if (isChangeLegendPlacement) {
                    newState.legend.placement = legendPlacement;
                }

                let newLegendHeight = reportConfig.DEFAULT_LEGEND_HEIGHT;

                if (legendRef && legendRef.current) {
                    newLegendHeight = Math.round(legendRef.current.getBoundingClientRect().height / props.transformScale);
                }

                newState.chart.top = reportConfig.MINIMUM_CHART_MARGIN;
                newState.chart.left = reportConfig.MINIMUM_CHART_MARGIN;

                let bottom = reportConfig.MINIMUM_CHART_MARGIN;
                let right = reportConfig.MINIMUM_CHART_MARGIN;

                if (newState.chart.isShowAxes) {
                    bottom = reportConfig.DEFAULT_AXIS_PADDING;

                    if (!isAllOnRight) {
                        newState.chart.left = reportConfig.DEFAULT_AXIS_PADDING;
                    }

                    if (!isAllOnLeft) {
                        right = reportConfig.DEFAULT_AXIS_PADDING;
                    }
                }

                switch (legendPlacement) {
                    case 'top':
                        newState.legend.height = newLegendHeight;
                        newState.chart.top = newLegendHeight;
                        break;
                    case 'bottom':
                        if (!newState.chart.isShowAxes) {
                            bottom = 0;
                        }

                        bottom = bottom + newLegendHeight;
                        newState.legend.height = newLegendHeight;
                        break;
                    case 'right':
                        if (!newState.chart.isShowAxes || isAllOnLeft) {
                            right = 0;
                        }

                        right = reportConfig.DEFAULT_LEGEND_WIDTH + right;
                        newState.legend.width = reportConfig.DEFAULT_LEGEND_WIDTH;
                        break;
                }

                newState.chart.width = props.width - newState.chart.left - right;
                newState.chart.height = props.height - newState.chart.top - bottom;
            }
        }

        if (Object.keys(newState).length) {
            setState({
                ...state,
                ...newState
            });
        }
    });

    function registerLegend(ref) {
        legendRef.current = ref;
    }

    function callbackChartResizing({chartSize, isMouseUp}) {
        if (chartSize) {
            const newState = {
                ...state,
                chart: {
                    ...state.chart,
                    ...chartSize,
                    isStatic: true
                }
            };

            setState(newState);
        }

        if (isMouseUp) {
            props.updateComponent({
                id: props.id,
                chartBorder: {
                    ...state.chart,
                    isStatic: true
                }
            });
        }
    }

    return {
        chart: state.chart,
        legend: state.legend,
        registerLegend,
        bind: {
            width: props.width,
            height: props.height,
            position: props.position,
            transformScale: props.transformScale,
            chartSize: state.chart,
            callback: callbackChartResizing
        }
    };
}
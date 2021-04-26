import React, {useState} from 'react';
import produce from 'immer';
import isEqual from 'react-fast-compare';

function getInitValue(params) {
    let initValue = [];

    if (params && Array.isArray(params.initValue)) {
        initValue = params.initValue;
    }

    return initValue;
}

/**
 * Ultility hook to provide array mutation-like state object
 * @param {Object} params Container config
 */
export function useArrayContainer (params) {
    const [container, setContainer] = useState(getInitValue(params));

    function addItem(item, index) {
        if (index >= 0) {
            // Add at index
            setContainer([
                ...container.slice(0, index),
                item,
                ...container.slice(index)
            ]);
        } else {
            // Add at end
            setContainer([
                ...container,
                item
            ]);
        }
    }

    function removeAt(index) {
        if (index < 0 || index > (container.length - 1)) {
            return;
        }

        setContainer([
            ...container.slice(0, index),
            ...container.slice(index + 1)
        ]);
    }

    function removeItem(item, compareKey) {
        setContainer(container.filter(row => {
            if (compareKey && row[compareKey] === item[compareKey]) {
                return false;
            }

            return !isEqual(row, item);
        }));
    }

    function changeItemAt(index, newItem) {
        if (index < 0 || index > (container.length - 1)) {
            return;
        }

        setContainer([
            ...container.slice(0, index),
            newItem,
            ...container.slice(index + 1)
        ]);
    }

    function swapTwoItems(firstIndex, secondIndex) {
        if (firstIndex < 0 || firstIndex > (container.length - 1) ||
            secondIndex < 0 || secondIndex > (container.length - 1) ||
            firstIndex === secondIndex) {
            return;
        }

        setContainer(produce(container, newContainer => {
            newContainer[firstIndex] = container[secondIndex];
            newContainer[secondIndex] = container[firstIndex];
        }));
    }

    function replaceContainer(newContainer) {
        setContainer(newContainer);
    }

    return {
        addItem,
        removeItem,
        changeItemAt,
        removeAt,
        swapTwoItems,
        container,
        replaceContainer
    };
}

export const withArrayContainer = (containerConfig) => (Component) => {
    return props => {
        const container = useArrayContainer(containerConfig);

        return (
            <Component container={container} {...props} />
        );
    };
};

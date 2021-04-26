import {useCallback, useEffect, useState, useRef} from 'react';
import {handleError} from 'Src/handleError';

const PATH = 'Src/hooks/useCustomDropdown.js';

const KEY_CODES = {
    ENTER: 13,
    BACKSPACE: 8,
    TAB: 9,
    SPACE: 32,
    LEFT_ARROW: 37,
    UP_ARROW: 38,
    RIGHT_ARROW: 39,
    DOWN_ARROW: 40,
    DELETE: 46
};

const useCustomDropdown = (props = {}) => {
    const {
        onPressEnter,
        activeItemQuery = '.active',
        defaultDropdownOpen = false,
        defaultIndex = -1,
        lazyLoadingConfig = {}
    } = props;

    const {totalRecordsCount, currentRecords = []} = lazyLoadingConfig;

    const [isOpen, setOpen] = useState(defaultDropdownOpen);
    const [page, setPage] = useState(1);
    const [activeItemIndex, setActiveItemIndex] = useState(defaultIndex);

    const dropdownRef = useRef(null);

    // Register ref
    const register = (ref) => dropdownRef.current = ref;

    const toggleOpen = () => setOpen(!isOpen);

    const itemCount = currentRecords.length;

    const onClickOutside = useCallback((event) => {
        try {
            if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        } catch (err) {
            handleError(err, {
                path: PATH,
                name: 'onClickOutSide'
            });
        }
    }, [isOpen]);

    const onScroll = useCallback(event => {
        // Handle lazy loading
        try {
            if (isOpen && dropdownRef.current) {
                if ((totalRecordsCount === undefined || itemCount < totalRecordsCount) &&
                    (event.target.scrollHeight - event.target.scrollTop - event.target.clientHeight) < 1) {
                    setPage(page + 1);
                }
            }
        } catch (err) {
            handleError(err, {
                path: PATH,
                name: 'onScroll'
            });
        }
    }, [isOpen, totalRecordsCount, lazyLoadingConfig, currentRecords]);

    // Reset active index
    useEffect(() => {
        if (isOpen) {
            setActiveItemIndex(defaultIndex);
        }
    }, [itemCount, defaultIndex, isOpen]);

    const onKeyDown = useCallback((event) => {
        try {
            if (isOpen && dropdownRef.current) {
                let currentItem = dropdownRef.current.querySelector(activeItemQuery);

                if (currentItem) {
                    switch (event.keyCode) {
                        case KEY_CODES.UP_ARROW:
                            if (activeItemIndex > 0) {
                                event.preventDefault();

                                currentItem = currentItem.previousSibling;
                                currentItem.scrollIntoView({block: 'nearest'});

                                setActiveItemIndex(activeItemIndex - 1);
                            }

                            break;
                        case KEY_CODES.DOWN_ARROW:
                            if (activeItemIndex < itemCount - 1) {
                                event.preventDefault();

                                currentItem = currentItem.nextSibling;
                                currentItem.scrollIntoView({block: 'nearest'});

                                setActiveItemIndex(activeItemIndex + 1);
                            }

                            break;
                        case KEY_CODES.ENTER:
                            if (typeof onPressEnter === 'function') {
                                onPressEnter();
                            }

                            break;
                    }
                }
            }
        } catch (err) {
            handleError(err, {
                path: PATH,
                name: 'onKeyDown'
            });
        }
    }, [isOpen, activeItemIndex, itemCount]);

    useEffect(() => {
        document.addEventListener('click', onClickOutside);

        return () => {
            document.removeEventListener('click', onClickOutside);
        };
    }, [onClickOutside]);

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [onKeyDown]);

    function resetPage() {
        setPage(1);
    }

    return {
        register,
        isOpen,
        toggleOpen,
        activeItemIndex,
        page,
        resetPage,
        onScroll
    };
};

export default useCustomDropdown;

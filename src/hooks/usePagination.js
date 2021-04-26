import React, {useState, useEffect, useRef, useMemo} from 'react';
import classnames from 'classnames';
import {handleError} from 'Src/handleError';

const PATH = 'Hooks/usePagination.js';

function usePagination(props) {
    const {records = [], recordsPerPage, totalRecords, pagesInARow = 5, render} = props;

    const [activePage, setActivePage] = useState(1);
    const [showingPages, setShowingPages] = useState([]);
    const [showingRecords, setShowingRecords] = useState(() => records.slice(0, recordsPerPage));

    const pagesCount = useMemo(() => Math.ceil(totalRecords / recordsPerPage),
        [totalRecords, recordsPerPage]);

    const onChangePagination = (pagination) => () => {
        try {
            if (pagination && pagination.value > 0 && pagination.value !== activePage && pagination.value <= pagesCount) {
                setActivePage(pagination.value);
            } else {
            // Change pagination
                switch (pagination.value) {
                    case 'first':
                        setActivePage(1);
                        break;
                    case 'prev':
                        if (activePage > 1) {
                            setActivePage(activePage - 1);
                        }
                        break;
                    case 'next':
                        if (activePage < pagesCount) {
                            setActivePage(activePage + 1);
                        }
                        break;
                    case 'last':
                        setActivePage(pagesCount);
                        break;
                    default:
                        break;
                }
            }

        } catch (e) {
            handleError(e, {
                component: PATH,
                action: 'onChangePagination',
                args: {
                    pagination
                }
            });
        }
    };

    useEffect(() => {
        try {
            // Pagination
            let arrPagination = [];

            if (pagesCount > 0) {
                arrPagination.push({
                    className: 'first',
                    label: '',
                    value: 'first',
                    icon: 'icon-ants-step-backward'
                });

                arrPagination.push({
                    className: 'prev',
                    label: '',
                    value: 'prev',
                    icon: 'icon-ants-caret-left'
                });

                if (activePage <= pagesInARow) {
                    let number = pagesInARow;

                    if (pagesCount <= pagesInARow) {
                        number = pagesCount;
                    }

                    for (let i = 1; i <= number; i++) {
                        arrPagination.push({
                            className: '',
                            label: i,
                            value: i,
                            active: i === activePage
                        });
                    }

                    if (pagesCount > 6) {
                        arrPagination.push({
                            className: '',
                            label: '...',
                            value: 6
                        });
                    }
                } else {
                    let number = Math.ceil(activePage / pagesInARow);

                    arrPagination.push({
                        className: '',
                        label: '...',
                        value: (number - 1) * pagesInARow - 1
                    });

                    const totalPage = Math.min(number * pagesInARow, pagesCount);

                    for (let i = (number - 1) * pagesInARow; i <= totalPage; i++) {
                        arrPagination.push({
                            className: '',
                            label: i,
                            value: i,
                            active: i === activePage
                        });
                    }

                    arrPagination.push({
                        className: '',
                        label: '...',
                        value: number * pagesInARow + 1
                    });
                }

                arrPagination.push({
                    className: 'next',
                    label: '',
                    value: 'next',
                    icon: 'icon-ants-caret-right'
                });

                arrPagination.push({
                    className: 'last',
                    label: '',
                    value: 'last',
                    icon: 'icon-ants-step-forward'
                });
            }

            setShowingPages(arrPagination);

            setShowingRecords(records.slice(
                (activePage - 1) * recordsPerPage,
                activePage * recordsPerPage
            ));

        } catch (e) {
            handleError(e, {
                component: PATH,
                action: 'useEffect',
                args: {
                    activePage, pagesCount
                }
            });
        }
    }, [activePage, pagesCount, records]);

    const renderPagination = () => {
        return typeof render === 'function' ? render() : (
            <ul className="pagination justify-content-end">
                {showingPages.map((pagination) => {
                    return (
                        <li
                            onClick={onChangePagination(pagination)}
                            key={'pagination' + pagination.value}
                            className={classnames(
                                'page-item',
                                pagination.className,
                                {active: pagination.active},
                                {disabled: pagination.disabled}
                            )}
                        >
                            <a className="page-link">
                                {pagination.label}
                                {pagination.icon ? <i className={pagination.icon} /> : null}
                            </a>
                        </li>
                    );
                })}
            </ul>
        );
    };

    return {activePage, showingRecords, renderPagination};
}

export default usePagination;
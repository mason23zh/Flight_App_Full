import React from "react";
import classnames from "classnames";
import { usePagination, DOTS } from "../hooks/usePagination";

function Pagination(props) {
    const {
        onPageChange,
        totalCount,
        siblingCount = 1,
        currentPage,
        pageSize,
        className,
    } = props;
    
    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize,
    });
    
    // If there are less than 2 times in pagination range we shall not render the component
    if (currentPage === 0 || paginationRange.length < 2) {
        return null;
    }
    
    const onNext = () => {
        onPageChange(currentPage + 1);
    };
    
    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };
    
    const lastPage = paginationRange[paginationRange.length - 1];
    return (
        <ul
            className="flex list-none"
        >
            {/* Left navigation arrow */}
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <button
                className={currentPage === 1 ? "" : "h-8 text-center text-[rgba(0,0,0,0.87)] flex box-border items-center tracking-[0.01071em] leading-[1.43] text-[13px] min-w-[32px] mx-1 my-auto px-3 py-0 rounded-2xl hover:bg-[rgba(0,0,0,0.04)] hover:cursor-pointer"}
                onClick={onPrevious}
            >
                <div className="rotate-[-135deg] -translate-x-2/4" />
            </button>
            {paginationRange.map((pageNumber) => {
                // If the pageItem is a DOT, render the DOTS unicode character
                if (pageNumber === DOTS) {
                    return <li className="bg-transparent cursor-default">&#8230;</li>;
                }
                    
                // Render our Page Pills
                return (
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
                    <li
                        className={classnames("pagination-item", {
                            selected: pageNumber === currentPage,
                        })}
                        onClick={() => onPageChange(pageNumber)}
                    >
                        {pageNumber}
                    </li>
                );
            })}
            {/*  Right Navigation arrow */}
            {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
            <li
                className={classnames("pagination-item", {
                    disabled: currentPage === lastPage,
                })}
                onClick={onNext}
            >
                <div className="arrow right" />
            </li>
        </ul>
    );
}

export default Pagination;

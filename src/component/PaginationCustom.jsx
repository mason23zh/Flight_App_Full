import React from "react";
import classnames from "classnames";
import { HiArrowNarrowLeft, HiArrowNarrowRight } from "react-icons/hi";
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
    console.log(currentPage);
    
    
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
                
            <button
                className={currentPage === 1 ? "" : "caret-blue-500 hover:bg-red-500"}
                onClick={onPrevious}
            >
                <HiArrowNarrowLeft />
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
                
            <button
                className={currentPage === lastPage ? "" : ""}
                onClick={onNext}
            >
                <HiArrowNarrowRight />
            </button>
        </ul>
    );
}

export default Pagination;

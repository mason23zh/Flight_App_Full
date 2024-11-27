import React, { forwardRef } from "react";

/*
* A custom scroll bar that used in the Virtuoso list
* */

interface ScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const Scroller = forwardRef<HTMLDivElement, ScrollerProps>(({
    className,
    ...props
}, ref) => {
    return (
        <div
            {...props}
            ref={ref}
            className={className || "scrollbar scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-gray-500"}
        />
    );
});

Scroller.displayName = "VirtuosoScroller";

export default Scroller;

import React, { forwardRef } from "react";
/*
* A custom scroll bar that used in the Virtuoso list
* */
//TODO: make className into props so the scrollbar style can be changed.
const Scroller = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
    return (
        <div
            {...props}
            ref={ref}
            className="scrollbar scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-gray-500"
        />
    );
});

Scroller.displayName = "VirtuosoScroller";

export default Scroller;
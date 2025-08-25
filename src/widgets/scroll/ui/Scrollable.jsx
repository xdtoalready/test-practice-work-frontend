import React, { useEffect, useRef } from "react";
import SimpleBarReact from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import "./Scroll.css";
export const Scrollable = ({
  children,
  direction = "y",
  style = {},
  isNative=false,
  ...props
}) => {
  const ref = useRef();
  useEffect(() => {
    if (!isNative && direction === "x" && ref.current) {
      const el = ref.current.el;
      debugger;

      const onWheel = (e) => {
        debugger;
        if (e.deltaY !== 0) {
          el.scrollLeft += e.deltaY;
          e.preventDefault();
        }
      };

      el.addEventListener("wheel", onWheel, { passive: false });

      return () => el.removeEventListener("wheel", onWheel);
    }
  }, [direction]);

  if (isNative) {
    return (
      <div
        ref={ref}
        className="native-scroll-container"
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <SimpleBarReact
      ref={ref}
      forceVisible={direction === 'all' ? true : direction}
      style={{
        maxWidth: "100%",
        maxHeight: "100%",
        overflowX: direction === "x" || direction==='all' ? "auto" : "hidden",
        overflowY: direction === "y" || direction==='all' ? "auto" : "hidden",
        ...style,
      }}
      {...props}
    >
      {children}
    </SimpleBarReact>
  );
};

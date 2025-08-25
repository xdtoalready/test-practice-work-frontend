import React from "react";
import {Scrollable} from "../../scroll";

const SwiperElement = ({ items, selectedItem, onClick }) => {
  return (
      <Scrollable direction={'x'}  style={{paddingBottom: '6px' }}>
    <div className="swiper-wrapper">

      {items.map((el, index) => (
        <div className="swiper-slide" key={el.id || index}>
          <a
            className={`shop__link js-tabs-link ${selectedItem === el.key ? "active" : ""}`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onClick(el);
            }}
          >
            {el.label}
          </a>
        </div>
      ))}
    </div>
      </Scrollable>

  );
};

export default SwiperElement;

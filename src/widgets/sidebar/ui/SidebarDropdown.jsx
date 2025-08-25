import React, { useState } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import { Dropdown } from "../../../shared/ui/dropdown/Dropdown";
import { Icon } from "../../../shared/ui/icon";

export const SidebarDropdown = ({
  title,
  icon,
  items,
  isExpanded = false,
  iconConfig = {},
  isMobile = false,
  isActive = false,
  className = "",
  style,
  onClick,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(isActive);

  const handleHeaderClick = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    if (onClick) {
      onClick();
    }
  };

  return (
    <Dropdown
      className={cn("sidebar__item sidebar__item_dropdown", className, {
        active: isOpen,
        wide: isExpanded,
        "seo-mobile": isMobile,
      })}
      isOpen={isOpen}
      onToggle={setIsOpen}
      contentClassName="sidebar__body"
      style={style}
      trigger={
        // <div className="sidebar__head" onClick={handleHeaderClick}>
        //   <svg className={`icon icon-${icon}`}>
        //     <use xlinkHref={`#icon-${icon}`}></use>
        //   </svg>
        //   {title}
        //   <svg className="icon icon-arrow-down">
        //     <use xlinkHref="#icon-arrow-down"></use>
        //   </svg>
        // </div>
        <div onClick={handleHeaderClick} className={"sidebar__head"}>
          <Icon
            className={"icon"}
            name={icon}
            viewBox={"0 0 24 24"}
            size={24}
            {...iconConfig}
          />
          {title}
          <svg className="icon icon-arrow-down">
            <use xlinkHref="#icon-arrow-down"></use>
          </svg>
        </div>
      }
    >
      {items.map((item, index) => (
        <Link
          key={index}
          to={item.to || "/"}
          className="sidebar__link"
          onClick={() => {
            item.onClick && item?.onClick();
            onClose();
          }}
        >
          {item.text}
        </Link>
      ))}
    </Dropdown>
  );
};

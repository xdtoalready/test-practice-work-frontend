import React, {useState} from "react";
import cn from "classnames";
import { useCompany } from "../../../pages/company";
import { Icon } from "../../../shared/ui/icon";
import ChatButton from "../../chat";

export const SidebarUser = ({
  className = "",
  avatarClassName = "",
  detailsClassName = "",
  subtitleClassName = "",
  contentClassName = "",
  defaultRole = "Менеджер",
  loadingComponent = <div className="sidebar__user-loading">Загрузка...</div>,
}) => {
  const { manager, isLoading, error } = useCompany();
    const [isOpen, setIsOpen] = useState(false);

  if (isLoading) {
    return loadingComponent;
  }

  if (error || !manager) {
    return (
      <div className={cn("header__notification", contentClassName)}>
        <div className={cn("header__details", detailsClassName)}>
          <div className="header__title">Нет данных о менеджере</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={cn("header__notification", contentClassName, className)}>
        <div className={cn("header__avatar", avatarClassName)}>
          <img
            src={manager.avatar || "/img/custom/illustration.svg"}
            alt={manager.name || "Менеджер"}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/img/custom/illustration.svg";
            }}
          />
        </div>
        <div className={cn("header__details", detailsClassName)}>
          <div className="header__line">{manager.name}</div>
          <div className={cn("header__content", subtitleClassName)}>
            {manager.role || defaultRole}
          </div>
        </div>
      </div>
      <div className={"sidebar__action"}>
        {manager.phone && (
          <a
            className={"button-stroke media__button"}
            href={`tel:${manager.phone}`}
          >
            <Icon viewBox={"0 0 16 16"} size={24} name={"phone"} />
          </a>
        )}
          <div
              className={"button-stroke media__button"}
              onClick={(e) => {
                  e.preventDefault();
                  // e.stopPropagation();
                  setIsOpen(true)
              }}
          >
              <Icon viewBox={"0 0 16 16"} size={24} name={"message"} />
          </div>
          <ChatButton setIsOpen={setIsOpen} isOpen={isOpen} />

      </div>
    </>
  );
};

import React, { useRef, useState } from "react";
import { useOutsideClick } from "../../../core/hooks/useOutsideClick";
import { Icon } from "../../../shared/ui/icon";
import { InfoModal } from "./InfoModal";
import { useBodyClassWhen } from "../../../core/hooks/useBodyClassWhen";

export const StatCard = ({
  title,
  value,
  change,
  comparedTo,
  children,
  infoTitle,
  infoDescription,
}) => {
  const isPositive = change >= 0;
  const isZero = change === 0;
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const ref = useRef(null);

  useOutsideClick(ref, () => setIsInfoOpen(false));
  useBodyClassWhen(isInfoOpen, "_info-modal-locked");

  return (
    <div
      className={`total card info-modal-wrap ${isInfoOpen ? "_active" : ""}`}
    >
      <div className="card__head">
        <div className="title-blue card__title" style={{ padding: 0 }}>
          {title}
        </div>
        {infoTitle && infoDescription && (
          <button
            className="button-square-stroke button-small filters__head info-modal-btn"
            onClick={() => setIsInfoOpen(!isInfoOpen)}
          >
            <Icon name="info" />
          </button>
        )}
      </div>
      {value && (
        <div
          className={`total__details info-modal-block ${isInfoOpen ? "_active" : ""}`}
        >
          <div className="h4 total__title">{value ?? "--"}</div>
          {change !== undefined && change !== null && (
            <div className="total__line">
              <div
                className={`balance background ${isPositive ? isZero ? 'zero' : "positive" : "negative"}`}
              >
                {/*<svg*/}
                {/*  className={`icon icon-arrow-${isPositive ? "top" : "bottom"}`}*/}
                {/*>*/}
                {/*  <use*/}
                {/*    xlinkHref={`#icon-arrow-${isPositive ? "top" : "bottom"}`}*/}
                {/*  ></use>*/}
                {/*</svg>*/}
                {Math.abs(change)}%
              </div>
              по сравнению с {comparedTo}
            </div>
          )}
          <InfoModal
            title={infoTitle}
            description={infoDescription}
            onClose={() => setIsInfoOpen(false)}
          />
        </div>
      )}
      <div ref={ref}>{children}</div>
    </div>
  );
};

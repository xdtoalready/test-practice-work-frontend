import React from "react";

const LockedCard = ({ label }) => {
  const subject = encodeURIComponent(
    `Здравствуйте! Хочу ${label.toLowerCase()}`,
  );
  const mailtoLink = `mailto:support@lead-bro.ru?body=${subject}`;

  return (
    <div className="total card">
      <img src="img/custom/Locked.svg" alt="" />
      <a
        href={mailtoLink}
        target="_blank"
        rel="noopener noreferrer"
        className="requests__titles-btn"
      >
        {label}
      </a>
    </div>
  );
};

export default LockedCard;

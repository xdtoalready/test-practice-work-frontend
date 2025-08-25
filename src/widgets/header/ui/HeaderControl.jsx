import React from "react";
import { Notifications } from "./Notifications";
import { Logout } from "../../../shared/ui/button/Logout";
import { useAuthStore } from "../../../pages/signin/state/signin.store";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../common/ui/ConfirmationModal";

export const HeaderControl = ({ notificationsActive, toggleNotifications }) => {
  const authStore = useAuthStore();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    authStore.logout();
    navigate("/signin");
    window.location.reload();

  };
  return (
    <div className="header__control">
      {/*<Notifications*/}
      {/*  isActive={notificationsActive}*/}
      {/*  onToggle={toggleNotifications}*/}
      {/*/>*/}
      <Logout onClick={()=>setIsConfirmModalOpen(true)} />
        <ConfirmationModal
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            onConfirm={handleLogout}
            label="Вы хотите выйти?"
        />
    </div>
  );
};

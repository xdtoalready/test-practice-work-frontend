import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {useOutsideClick} from "../../../core/hooks/useOutsideClick";
import {Modal} from "../../../shared/ui/modal";
import {Button} from "../../../shared/ui/button";
import './ConfirmationModal.css'

const ConfirmationModal = ({ isOpen, onClose, onConfirm, label }) => {
    const confirmRef = useRef();
    useOutsideClick(confirmRef, onClose);
    if (!isOpen) return null;

    return (
        <Modal
            onClose={onClose}
            isOpen={isOpen}
            onConfirm={onConfirm}
            wrapperClassName={'confirmation-modal'}
        >
            <div className={'confirmationContent'}>
                <h3 className="task-modal__title">{label}</h3>
                <div className={'confirmationButtons'} >
                    <Button
                        className={'confirmButton'}
                        variant={"primary"}
                        onClick={(e) =>{
                            e?.preventDefault();
                            e?.stopPropagation();
                            onConfirm();
                        }}
                    >
                        <span>Да</span>
                    </Button>
                    <Button
                        className={'confirmButton'}
                        variant={"stroke"}
                        onClick={(e) =>{
                            e?.preventDefault();
                            e?.stopPropagation();
                            onClose();
                        }}
                    >
                        <span>Нет</span>
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmationModal;

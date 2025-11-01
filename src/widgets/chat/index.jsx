import {Icon} from "../../shared/ui/icon";
import React, {useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {apiClient2} from "../../shared/api/client";
import {useOutsideClick} from "../../core/hooks/useOutsideClick";
import {createPortal} from "react-dom";
import {useAuthStore} from "../../pages/signin/state/signin.store";
import useOneTimeAuth from "../../core/hooks/useOneTimeAuth";


const FabOverlay = ({onClose, chatToken, chatCompanyId}) => {
    const iframeUrl = `${process.env.REACT_APP_API_URL_2}/chats/${chatCompanyId}`
    const [isLoaded,setIsLoaded] = useState(false);
    const overlayRef = useRef(null);
    // useOutsideClick(overlayRef, onClose, 'chat-root');
    useOneTimeAuth(chatToken, setIsLoaded);

    const frame = useMemo(()=>{
        if(isLoaded){
            debugger
            return <iframe
                src={iframeUrl}
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Чаты"
            />
        } else {
            return  <div>Идёт авторизация...</div>
        }
    },[isLoaded,chatCompanyId,iframeUrl])
    if(!chatToken) return <></>


    return (
        <div ref={overlayRef} style={{
            position: 'fixed', top: 70, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 10000,
        }}>
            <div style={{
                position: 'relative', width: '100%', height: '100%',
                backgroundColor: '#fff',
            }}>
                <button
                    id={'fab-chat-close'}
                    onClick={()=>{
                        debugger
                        onClose()
                    }}
                    style={{
                        position: 'absolute', top: 8, right: 56,
                        zIndex: 1001,
                        color: '#fff',
                        background: 'transparent', border: 'none',
                        fontSize: 36,
                    }}
                >
                    ×
                </button>

                {frame}
            </div>
        </div>
    )
}

const ChatButton = ({isOpen,setIsOpen}) => {
    const chatToken =  localStorage.getItem('one_time_token');
    const {user} = useAuthStore()
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = '';
        }

        return () => {
            document.body.style.overflowY = '';
        };
    }, [isOpen]);
    const fab = (
        <>

            {isOpen && <FabOverlay chatCompanyId={user.conversation_id} chatToken={chatToken} onClose={() => setIsOpen(false)} isOpen={isOpen} />}
        </>
    );

    return createPortal(fab, document.getElementById('chat-root'));
};

export default ChatButton;

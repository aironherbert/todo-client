import React from "react";

import "./styles.css";

function Modal({ children, shown, close, title }: { children: React.ReactNode; shown: boolean; close: () => void, title: string }) {
    return shown ? (
        <>
            <h2>{title}</h2>
            <div
                className="modal-backdrop"
                onClick={() => {
                    // close modal when outside of modal is clicked
                    close();
                }}
            >
                <div
                    className="modal-content"
                    onClick={e => {
                        // do not close modal if anything inside modal content is clicked
                        e.stopPropagation();
                    }}
                >
                    <button onClick={close}>Close</button>
                    {children}
                </div>
            </div>
        </>
    ) : null;
}
export default function ModalApp({ children, isOpen, onClose, title }: { children: React.ReactNode, isOpen: boolean, onClose: () => void, title: string }) {
    return (
        <div className="modal-app">
            <Modal
                shown={isOpen}
                close={() => {
                    onClose();
                }}
                title={title}
            >
                {children}
            </Modal>
        </div>
    );
}

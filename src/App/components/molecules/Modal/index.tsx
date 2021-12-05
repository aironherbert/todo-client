import React from "react";

import "./styles.css";

function Modal({ children, shown, close }: { children: React.ReactNode; shown: boolean; close: () => void }) {
    return shown ? (
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
    ) : null;
}
export default function ModalApp({ children, isOpen, onClose }: { children: React.ReactNode, isOpen: boolean, onClose: () => void }) {
    return (
        <div className="modal-app">
            <Modal
                shown={isOpen}
                close={() => {
                    onClose();
                }}
            >
                {children}
            </Modal>
        </div>
    );
}

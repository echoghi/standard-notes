import { useEffect } from 'react';
import ReactDOM from 'react-dom';

function Modal({ children }: { children: React.ReactNode }) {
    // This is the DOM element we want to render the portal into
    const modalRoot = document.getElementById('modal-root');

    useEffect(() => {
        // Create a DOM element to render the portal into
        const el = document.createElement('div');

        // Append the DOM element to the DOM
        modalRoot?.appendChild(el);

        // Return a function to remove the DOM element
        return () => {
            modalRoot?.removeChild(el);
        };
    }, [modalRoot]);

    // Use the createPortal method to render the children
    // into the DOM element
    return ReactDOM.createPortal(children, modalRoot);
}

export default Modal;

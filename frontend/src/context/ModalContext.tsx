import React, {createContext, useState, ReactNode} from 'react'

type ModalContextType = {

    visible: boolean,
    content: React.ReactNode,
    openModal: (content: React.ReactNode) => void,
    closeModal: () => void

}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children } : {children: ReactNode}) => {

    const [visible, setVisible] = useState(false);
    const [content, setContent] = useState<ReactNode>(null);

    const openModal = (newContent: ReactNode) => {

        setContent(newContent);
        setVisible(true);

    };

    const closeModal = () => {
        
        setVisible(false);
        setContent(null);
       
    };

    return (

        <ModalContext.Provider value={{visible, content, openModal, closeModal}} >
            { children }
        </ModalContext.Provider>

    )

}

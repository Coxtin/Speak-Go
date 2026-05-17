import React, { cloneElement, isValidElement, useContext } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native'
import { ModalContext } from '../context/ModalContext';

const GlobalModal = () => {

    const context = useContext(ModalContext);
    const modalContent =
        isValidElement(context?.content) && (typeof context.content.type === 'function' || typeof context.content.type === 'object')
            ? cloneElement(context.content as React.ReactElement<{ inModal?: boolean }>, { inModal: true })
            : context?.content;

    if (!context || !context.visible){
        return null;
    }

    return (

        <Modal
            animationType='slide'
            transparent={true}
            visible={context?.visible}
            onRequestClose={() => {
                console.log("Am inchis modal-ul!");
                context.closeModal();
            }}
        >

            <View
                className='flex-1 justify-end bg-black/50'
            > 

                <TouchableOpacity
                    activeOpacity={1}
                    onPress={context.closeModal}
                    className='flex-1'
                />

                <View
                    className='bg-white rounded-t-3xl min-h-[50%] max-h-[90%] p-5 shadow-2xl'
                >
                    <View
                        className='w-12 h-1.5 bg-gray-300 rounded-full self-center mb-5'
                    />

                    <View className='flex-1'>
                        {modalContent}
                    </View>
                </View>

            </View>

        </Modal>

    )

}

export default GlobalModal

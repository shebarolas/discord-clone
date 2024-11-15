import React from "react";
import { create } from "zustand";

export type ModalType = 'createServer';

interface State {
    type: ModalType | null;
    isOpen: boolean;
    content: React .ReactNode 
}

interface Action {
    setIsOpne: (isOpen: boolean) => void;
    setContent: (content: React.ReactNode) => void;
    openModal: (type: ModalType) => void;
    closeModal: () => void;
}

export const modalStore = create<State & Action>((set) =>({
    isOpen: false,
    setIsOpne: (isOpen) => set({isOpen}),
    type: null,
    content: null,
    setContent: (content) => set({content}),
    openModal: (type) => set({isOpen: true, type}),
    closeModal: ()=> set({isOpen: false, type:null})
}))

export const useModal = modalStore;
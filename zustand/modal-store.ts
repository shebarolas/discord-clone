import { Server } from "@prisma/client";
import { create } from "zustand";
export type ModalType =
  | "createServer"
  | "inivte"
  | "editServer"
  | "editMembers"
  | "createChannel"
  | "leaveServer" | "deleteServer"
interface DataModal {
  server?: Server;
}

interface State {
  isOpen: boolean;
  type: ModalType | null;
  data?: DataModal;
}

interface Action {
  onOpen: (type: ModalType, data?: DataModal) => void;
  onClose: () => void;
}

export const modalStore = create<State & Action>((set) => ({
  isOpen: false,
  type: null,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null }),
}));

export const useModal = modalStore;

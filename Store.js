import { create } from "zustand";
import { getAppointment } from "./lib/actions/createAppointment";

const initialState = {
  firstData: {},
  isOpen: false,
  data: [],
  isModalOpened: false,
};

export const store = create((set, get) => ({
  ...initialState,
  setFirstData: (data) => {
    set({ firstData: data });
    const storedData = get().firstData;
    localStorage.setItem("firstData", JSON.stringify(storedData));
  },
  toggleModal: (i) => {
    set({ isOpen: i });
  },
  getData: async () => {
    try {
      const result = await getAppointment();
      const dataWithStatus = result.documents.map((d) => ({
        ...d,
        status: "pending",
      }));
      set({ data: dataWithStatus });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  changeStatus: (id, newStatus) => {
    const data = get().data.map((d) => {
      if (d.$id === id) {
        return { ...d, status: newStatus };
      }
      return d;
    });
    set({ data });
  },
  setOpenModal: (state) => {
    set({ isModalOpened: state });
  },
}));

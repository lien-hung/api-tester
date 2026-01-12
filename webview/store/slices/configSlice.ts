import { StateCreator } from "zustand";
import { IConfigSlice } from "./type";

const configSlice: StateCreator<
  IConfigSlice,
  [],
  [],
  IConfigSlice
> = (set) => ({
  customMethods: [],

  setConfig: (config) => {
    set(() => ({
      customMethods: config.customMethods
    }));
  },
});

export default configSlice;
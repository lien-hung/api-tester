import { StateCreator } from "zustand";
import { WIDTH } from "../../constants";

import { IResizeBarSlice } from "./type";

const resizebarSlice: StateCreator<
  IResizeBarSlice,
  [],
  [],
  IResizeBarSlice
> = (set) => ({
  requestMenuWidth: WIDTH.INITIAL_WIDTH,

  handleRequestWidthChange: (value: number) =>
    set(() => ({ requestMenuWidth: `${value}vw` })),
});

export default resizebarSlice;

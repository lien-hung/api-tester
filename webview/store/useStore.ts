import { create } from "zustand";

import keyValueTableDataSlice from "./slices/keyValueTableDataSlice";
import requestDataSlice from "./slices/requestDataSlice";
import resizeBarSlice from "./slices/resizeBarSlice";
import responseDataSlice from "./slices/responseDataSlice";

import {
  IRequestDataSlice,
  IResponseDataSlice,
  IResizeBarSlice,
  IKeyValueTableDataSlice,
} from "./slices/type";

const useStore = create<
  IRequestDataSlice &
  IResponseDataSlice &
  IResizeBarSlice &
  IKeyValueTableDataSlice
>()((...set) => ({
  ...requestDataSlice(...set),
  ...responseDataSlice(...set),
  ...resizeBarSlice(...set),
  ...keyValueTableDataSlice(...set),
}));

export default useStore;

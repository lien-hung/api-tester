import { create } from "zustand";

import configSlice from "./slices/configSlice";
import keyValueTableDataSlice from "./slices/keyValueTableDataSlice";
import requestDataSlice from "./slices/requestDataSlice";
import resizeBarSlice from "./slices/resizeBarSlice";
import responseDataSlice from "./slices/responseDataSlice";

import {
  IRequestDataSlice,
  IResponseDataSlice,
  IResizeBarSlice,
  IKeyValueTableDataSlice,
  IConfigSlice
} from "./slices/type";

const useStore = create<
  IRequestDataSlice &
  IResponseDataSlice &
  IResizeBarSlice &
  IKeyValueTableDataSlice &
  IConfigSlice
>()((...set) => ({
  ...requestDataSlice(...set),
  ...responseDataSlice(...set),
  ...resizeBarSlice(...set),
  ...keyValueTableDataSlice(...set),
  ...configSlice(...set),
}));

export default useStore;

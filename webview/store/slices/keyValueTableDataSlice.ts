import { StateCreator } from "zustand";
import { COMMON, REQUEST } from "../../constants";
import { IKeyValueTableDataSlice } from "./type";

const keyValueTableDataSlice: StateCreator<
  IKeyValueTableDataSlice,
  [],
  [],
  IKeyValueTableDataSlice
> = (set) => ({
  keyValueTableData: [
    {
      id: crypto.randomUUID(),
      optionType: REQUEST.PARAMS,
      isChecked: false,
      key: "",
      value: "",
    },

    {
      id: crypto.randomUUID(),
      optionType: COMMON.HEADERS,
      isChecked: true,
      key: REQUEST.CACHE_CONTROL,
      value: REQUEST.NO_CACHE,
    },
    {
      id: crypto.randomUUID(),
      optionType: COMMON.HEADERS,
      isChecked: true,
      key: REQUEST.ACCEPT,
      value: REQUEST.ANY_MIME_TYPE,
    },
    {
      id: crypto.randomUUID(),
      optionType: COMMON.HEADERS,
      isChecked: true,
      key: REQUEST.ACCEPT_ENCODING,
      value: `${REQUEST.GZIP},${REQUEST.DEFLATE}`,
    },
    {
      id: crypto.randomUUID(),
      optionType: COMMON.HEADERS,
      isChecked: true,
      key: REQUEST.CONNECTION,
      value: REQUEST.KEEP_ALIVE,
    },
    {
      id: crypto.randomUUID(),
      optionType: COMMON.HEADERS,
      isChecked: false,
      key: "",
      value: "",
    },
    
    {
      id: crypto.randomUUID(),
      optionType: REQUEST.FORM_DATA,
      isChecked: false,
      key: "",
      value: "",
    },
    {
      id: crypto.randomUUID(),
      optionType: REQUEST.FORM_URLENCODED,
      isChecked: false,
      key: "",
      value: "",
    },
  ],

  handleRequestCheckbox: (dataId) =>
    set((state) => ({
      keyValueTableData: state.keyValueTableData.map((tableData) =>
        dataId === tableData.id
          ? { ...tableData, isChecked: !tableData.isChecked }
          : tableData,
      ),
    })),

  handleRequestKey: (dataId, detail) =>
    set((state) => ({
      keyValueTableData: state.keyValueTableData.map((tableData) =>
        dataId === tableData.id ? { ...tableData, key: detail } : tableData,
      ),
    })),

  handleRequestValue: (dataId, detail) =>
    set((state) => ({
      keyValueTableData: state.keyValueTableData.map((tableData) =>
        dataId === tableData.id ? { ...tableData, value: detail } : tableData,
      ),
    })),

  addRequestBodyHeaders: (headerValue) =>
    set((state) => ({
      keyValueTableData: [
        {
          id: crypto.randomUUID(),
          optionType: COMMON.HEADERS,
          isChecked: true,
          key: REQUEST.CONTENT_TYPE,
          value: headerValue,
        },
        ...state.keyValueTableData,
      ],
    })),

  removeRequestBodyHeaders: () => {
    set((state) => ({
      keyValueTableData: state.keyValueTableData.filter(
        (keyValueData) => keyValueData.key !== REQUEST.CONTENT_TYPE,
      ),
    }));
  },

  addNewTableRow: (type) =>
    set((state) => ({
      keyValueTableData: [
        ...state.keyValueTableData,
        {
          id: crypto.randomUUID(),
          optionType: type,
          isChecked: false,
          key: "",
          value: "",
        },
      ],
    })),

  deleteTableRow: (dataId) => {
    set((state) => ({
      keyValueTableData: state.keyValueTableData.filter(
        (tableData) => tableData.id !== dataId,
      ),
    }));
  },

  handleSidebarCollectionHeaders: (headers) => {
    set(() => {
      return {
        keyValueTableData: [...headers],
      };
    });
  },
});

export default keyValueTableDataSlice;
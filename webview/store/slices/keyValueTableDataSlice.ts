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
      optionType: REQUEST.PARAMS,
      isChecked: false,
      key: "",
      value: "",
    },
    {
      optionType: COMMON.HEADERS,
      isChecked: true,
      key: REQUEST.CACHE_CONTROL,
      value: REQUEST.NO_CACHE,
    },
    {
      optionType: COMMON.HEADERS,
      isChecked: true,
      key: REQUEST.ACCEPT,
      value: REQUEST.ANY_MIME_TYPE,
    },
    {
      optionType: COMMON.HEADERS,
      isChecked: true,
      key: REQUEST.ACCEPT_ENCODING,
      value: `${REQUEST.GZIP},${REQUEST.DEFLATE}`,
    },
    {
      optionType: COMMON.HEADERS,
      isChecked: true,
      key: REQUEST.CONNECTION,
      value: REQUEST.KEEP_ALIVE,
    },

    {
      optionType: COMMON.HEADERS,
      isChecked: false,
      key: "",
      value: "",
    },
    {
      optionType: REQUEST.FORM_DATA,
      isChecked: false,
      key: "",
      value: "",
    },
    {
      optionType: REQUEST.FORM_URLENCODED,
      isChecked: false,
      key: "",
      value: "",
    },
  ],

  handleRequestCheckbox: (dataIndex) =>
    set((state) => ({
      keyValueTableData: state.keyValueTableData.map((tableData, index) =>
        dataIndex === index
          ? { ...tableData, isChecked: !tableData.isChecked }
          : tableData,
      ),
    })),

  handleRequestKey: (dataIndex, detail) =>
    set((state) => ({
      keyValueTableData: state.keyValueTableData.map((tableData, index) =>
        dataIndex === index ? { ...tableData, key: detail } : tableData,
      ),
    })),

  handleRequestValue: (dataIndex, detail) =>
    set((state) => ({
      keyValueTableData: state.keyValueTableData.map((tableData, index) =>
        dataIndex === index ? { ...tableData, value: detail } : tableData,
      ),
    })),

  addRequestBodyHeaders: (headerValue) =>
    set((state) => ({
      keyValueTableData: [
        {
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
          optionType: type,
          isChecked: false,
          key: "",
          value: "",
        },
      ],
    })),

  deleteTableRow: (dataIndex) => {
    set((state) => ({
      keyValueTableData: state.keyValueTableData.filter(
        (_, index) => index !== dataIndex,
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
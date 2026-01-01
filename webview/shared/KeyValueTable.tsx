import React, { memo } from "react";
import styled from "styled-components";
import { IResponseDataHeader } from "../store/slices/type";

import addIcon from "../assets/svg/add-icon.svg";
import deleteIcon from "../assets/svg/delete-icon.svg";

interface IKeyValueTableProps {
  type?: string;
  title?: string;
  readOnly: boolean;
  addNewTableRow?: (type: string) => void;
  deleteTableRow?: (index: number) => void;
  handleRequestKey?: (index: number, value: string) => void;
  keyValueTableData:
    | {
        optionType: string;
        isChecked: boolean;
        key: string;
        value: string;
      }[]
    | IResponseDataHeader[];
  handleRequestValue?: (index: number, value: string) => void;
  handleRequestCheckbox?: (index: number) => void;
}

const KeyValueTable = ({
  type,
  title,
  readOnly,
  addNewTableRow,
  deleteTableRow,
  handleRequestKey,
  keyValueTableData,
  handleRequestValue,
  handleRequestCheckbox,
}: IKeyValueTableProps) => {
  return (
    <TableContainerWrapper>
      <TableContainer>
        {title && <h2>{title}</h2>}
        <Table readOnlyMode={readOnly}>
          <thead>
            <tr>
              {!readOnly && <th></th>}
              <th>Key</th>
              <th>Value</th>
              {!readOnly && (
                <th className="tableIconContainer">
                  <IconButton
                    className="tableIcon addButton"
                    onClick={() => type && addNewTableRow && addNewTableRow(type)}
                  >
                    <img src={addIcon} />
                  </IconButton>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {keyValueTableData.map(
              (
                { optionType, isChecked, key, value }: any,
                index: number,
              ) => (
                <React.Fragment key={index}>
                  {optionType === type && (
                    <tr>
                      {!readOnly && (
                        <th className="tableIconContainer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() =>
                              handleRequestCheckbox &&
                              handleRequestCheckbox(index)
                            }
                          />
                        </th>
                      )}
                      <td>
                        <input
                          type="text"
                          name="Key"
                          placeholder="Key"
                          value={key}
                          onChange={(event) =>
                            handleRequestKey &&
                            handleRequestKey(index, event.target.value)
                          }
                          readOnly={readOnly}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="Value"
                          placeholder="Value"
                          value={value}
                          onChange={(event) =>
                            handleRequestValue &&
                            handleRequestValue(index, event.target.value)
                          }
                          readOnly={readOnly}
                        />
                      </td>
                      {!readOnly && (
                        <th className="tableIconContainer">
                          <IconButton
                            className="tableIcon"
                            onClick={() => deleteTableRow && deleteTableRow(index)}
                          >
                            <img src={deleteIcon} />
                          </IconButton>
                        </th>
                      )}
                    </tr>
                  )}
                </React.Fragment>
              ),
            )}
          </tbody>
        </Table>
      </TableContainer>
    </TableContainerWrapper>
  );
};

const IconButton = styled.button`
  background: none;

  &:hover {
    background: none;
  }
`;

const TableContainerWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex: 1 1 auto;
  overflow-y: scroll;
`;

const TableContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-right: 1rem;

  h2 {
    margin: 1.3rem 0;
    opacity: 0.9;
  }
`;

const Table = styled.table<{ readOnlyMode: boolean }>`
  width: 100%;
  border-collapse: collapse;

  thead {
    font-size: 1.1rem;
    user-select: none;
  }

  th,
  td {
    font-weight: 500;
    text-align: left;
    padding: 0.3rem 1.2rem;
    border: 0.1rem solid rgb(55, 55, 55);
  }

  input {
    background-color: transparent;
    color: var(--default-text);
    font-style: ${(props) => props.readOnlyMode && "italic"};
    font-weight: ${(props) => props.readOnlyMode && "300"};
    opacity: ${(props) => props.readOnlyMode && "0.75"};
  }

  .tableIconContainer {
    width: 2rem;
    text-align: center;
    padding: 0.3rem;
  }

  .tableIcon {
    text-align: center;
    cursor: pointer;

    &:hover {
      opacity: 0.7;
    }
  }

  .addButton {
    width: 2rem;
  }
`;

export default memo(KeyValueTable);

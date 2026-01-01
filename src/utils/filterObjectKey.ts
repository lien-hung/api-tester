import { IRequestTreeItemState } from "./type";

const filterObjectKey = (
  {
    userRequestHistory,
  }: { userRequestHistory: IRequestTreeItemState[] | undefined },
  id: string,
  filterableKey: string[],
) => {
  if (!userRequestHistory) {
    return;
  }

  const [{ ...selectedCollection }] = userRequestHistory.filter(
    (history) => history.id === id,
  );

  filterableKey.forEach(
    (key, index) =>
      delete selectedCollection[key[index] as keyof IRequestTreeItemState],
  );

  return selectedCollection;
};

export default filterObjectKey;

import { IRequestTreeItemState } from "./type";

const filterDuplicatesFromObject = (
  currentCollection: IRequestTreeItemState[],
  previousCollection: IRequestTreeItemState[],
  id: string,
) => {
  const arr: string[] = [];
  const filteredCurrentCollection = currentCollection.filter(
    (history) => history.isUserFavorite,
  );

  const filteredPreviousCollection =
    previousCollection?.filter((history) => history.id !== id) || [];

  const combinedCollection = [
    ...filteredCurrentCollection,
    ...filteredPreviousCollection,
  ];

  const duplicateFilteredCollection = combinedCollection.filter((history) => {
    if (!arr.includes(history.id)) {
      arr.push(history.id);
      return history;
    }
  });

  return duplicateFilteredCollection;
};

export default filterDuplicatesFromObject;

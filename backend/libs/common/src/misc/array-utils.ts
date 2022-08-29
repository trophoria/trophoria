/**
 * Returns an array with all elements but the element which
 * should be removed. If no element to remove was provided,
 * the provided array gets returned. This method does not
 * manipulate the original array.
 *
 * @param arr     The array to remove the element from
 * @param remove  The element which should get removed
 * @returns       The array without the provided element
 */
export const removeIfExists = <T>(arr: T[], remove?: T) => {
  if (!remove) return arr;
  return arr.filter((element) => element !== remove);
};

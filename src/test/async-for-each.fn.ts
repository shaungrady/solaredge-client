export function asyncForEach<T>(
  arr: Array<T>,
  iterator: (element: T, index: number, array: T[]) => Promise<unknown>
): Promise<unknown[]> {
  const promises: Promise<unknown>[] = []
  arr.forEach((element, index, array) =>
    promises.push(iterator(element, index, array))
  )
  return Promise.all(promises)
}

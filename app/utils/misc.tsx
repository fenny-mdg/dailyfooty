export function getErrorMessage(error: unknown) {
  if (typeof error === "string") return error;
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  console.error("Unable to get error message for error", error);
  return "Unknown Error";
}

export function generatePagination({
  pageCount,
  currentPage = 1,
  max = 7,
  separator = "...",
}: {
  pageCount: number;
  currentPage?: number;
  max?: number;
  separator?: string;
}) {
  const hasMoreItemsThanMax = pageCount > max;
  const paginationLabels: string[] = Array.from(
    { length: hasMoreItemsThanMax ? max : pageCount },
    (_, index) => `${index + 1}`,
  );

  if (hasMoreItemsThanMax) {
    const middleIndex = Math.floor(max / 2);
    paginationLabels[middleIndex] = separator;

    const lastPages = paginationLabels.slice(middleIndex + 1);

    for (let index = lastPages.length - 1; index >= 0; index--) {
      const currentIndex = middleIndex + index + 1;
      const currentValue = pageCount - (lastPages.length - 1 - index);
      paginationLabels[currentIndex] = `${currentValue}`;
    }
  }

  if (!paginationLabels.includes(`${currentPage}`)) {
    const labelsIncludingCurrentPage = [
      separator,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      separator,
    ].map((item) => `${item}`);
    const spaceLeft = Math.floor((max - labelsIncludingCurrentPage.length) / 2);

    return [
      ...paginationLabels.slice(0, spaceLeft),
      ...labelsIncludingCurrentPage,
      ...paginationLabels.slice(labelsIncludingCurrentPage.length + spaceLeft),
    ];
  }

  return paginationLabels;
}

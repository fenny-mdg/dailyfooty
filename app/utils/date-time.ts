export const getRelativeDateFromNow = (date: string, locale = "en"): string => {
  const relativeTimeFormat = new Intl.RelativeTimeFormat(locale, {
    style: "short",
    numeric: "auto",
    localeMatcher: "best fit",
  });
  const diffSeconds = Math.abs((new Date(date).getTime() - Date.now()) / 1000);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const diff: { value: number; unit: any } = {
    value: diffSeconds,
    unit: "seconds",
  };

  switch (true) {
    case diffSeconds / (60 * 60) >= 24:
      return Intl.DateTimeFormat(locale, {
        timeStyle: "short",
        dateStyle: "short",
      }).format(new Date(date || ""));
    case diffSeconds / (60 * 60) >= 1: {
      diff.unit = "hours";
      diff.value = diffSeconds / (60 * 60);
      break;
    }
    case diffSeconds >= 60: {
      diff.unit = "minutes";
      diff.value = diffSeconds / 60;
      break;
    }
    default:
      break;
  }

  return relativeTimeFormat.format(-Math.round(diff.value), diff.unit);
};

export const formatFixtureDate = (date: number) => {
  const dateStr = `${date}`;
  const splittedDate = dateStr.split("");
  const month = splittedDate.slice(4, 6).join("");
  const day = splittedDate.slice(6, 8).join("");

  return `${day}/${month}`;
};

export const splitDate = (date: Date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  return [year, month, day];
};

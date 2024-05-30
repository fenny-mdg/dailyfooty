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

export const dateAdd = (
  date: Date,
  quantity: number,
  unit: "day" | "month" | "year",
) => {
  let [year, month, day] = splitDate(date);

  switch (unit.toLowerCase()) {
    case "day":
      day += quantity;
      break;
    case "month":
      month += quantity;
      break;
    case "year":
      year += quantity;
      break;

    default:
      throw new Error("unit not supported");
  }

  return new Date(year, month, day);
};

export const toZeroUTC = (date: Date = new Date()) => {
  const timezoneHour = -(date.getTimezoneOffset() / 60);
  const timezoneMinute = -(date.getTimezoneOffset() % 60);
  const [year, month, day] = splitDate(date);

  // We want that date has 00:00:00 as time
  return new Date(year, month, day, timezoneHour, timezoneMinute, 0, 0);
};

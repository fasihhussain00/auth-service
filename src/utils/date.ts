export const getFDate = () =>
  new Date().toLocaleDateString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
export const getFTime = (tz: string = "UTC", padAllowed: boolean = false) => {
  let FDate = new Date().toLocaleTimeString("en-us", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: tz,
  });
  if (padAllowed) {
    return FDate;
  } else {
    FDate = FDate.replace(/^0/, "");
  }
  return FDate;
};

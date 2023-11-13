import useragent from "useragent";

export const getUserAgentInfo = (userAgent: string) => {
  const parsedUserAgent = useragent.parse();
  const browser = parsedUserAgent.family || "Unknown";
  const os = parsedUserAgent.os.family || "Unknown";
  return { parsedUserAgent, browser, os };
};

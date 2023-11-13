export const getHosts = (uris: string[]) => {
  const hosts = uris.map((uri) => {
    if(!uri) return null;
    try {
      const host = new URL(uri).hostname;
      return host;
    } catch (error) {
      return null;
    }
  });
  return hosts;
};
export const allowedDomain = (domains: string[], allowedDomains: string[]) => {
  return domains.every((domain) => allowedDomains.includes(domain));
};

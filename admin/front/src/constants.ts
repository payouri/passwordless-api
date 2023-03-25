export const API_URL = ((): string => {
  console.log(process.env.NODE_ENV);
  if (process.env.NODE_ENV === "production") {
    return "https://api.domain.com";
  }
  return "http://localhost:3001";
})();

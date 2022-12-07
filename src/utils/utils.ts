export const saveEmailToLocalstorage = (email: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("email", email);
  }
};

export const getEmailFromLocalstorage = () => {
  if (typeof window !== "undefined") return localStorage.getItem("email") ?? "";
  return "";
};

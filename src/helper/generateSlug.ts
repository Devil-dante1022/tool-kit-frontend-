export const getSlug = (title: string) => {
  return title
    ?.replace(/[^a-zA-Z]/g, "-")
    .replace(/^-+|-+(?=-|$)/g, "")
    .toLowerCase();
};

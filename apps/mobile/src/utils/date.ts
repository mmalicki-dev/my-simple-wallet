export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

export const currentMonthRange = () => {
  const today = new Date();
  const from = new Date(today.getFullYear(), today.getMonth(), 1);
  return { from: isoDate(from), to: isoDate(today) };
};

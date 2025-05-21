export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR');
};

export const formatDateInput = (dateStr) => {
  // Takes a date string and formats it as YYYY-MM-DD for input[type="date"]
  try {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  } catch (error) {
    return new Date().toISOString().split('T')[0];
  }
};

export const getTotalBillsAmount = (bills) => {
  return bills.reduce((total, bill) => total + bill.value, 0);
};

export const getDaysUntilDate = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const isDateApproaching = (dateStr) => {
  const daysUntil = getDaysUntilDate(dateStr);
  return daysUntil >= 0 && daysUntil <= 7;
};

export const isDateOverdue = (dateStr) => {
  return getDaysUntilDate(dateStr) < 0;
};

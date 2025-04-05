export const formatterAmount = (value) => {
    if (typeof value !== 'number') return '';
    return (value / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };
  
export const formatDateToPtBr = (dateString) => {
   const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
   });
  
  return formatter.format(new Date(dateString));
}
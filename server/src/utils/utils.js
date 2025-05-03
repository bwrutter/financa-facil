const isValidCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]+/g, "");

  if (cpf.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let sum = 0;
  let remainder;

  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  remainder = sum % 11;
  if (remainder < 2) {
    remainder = 0;
  } else {
    remainder = 11 - remainder;
  }
  if (parseInt(cpf.charAt(9)) !== remainder) {
    return false;
  }

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = sum % 11;
  if (remainder < 2) {
    remainder = 0;
  } else {
    remainder = 11 - remainder;
  }
  if (parseInt(cpf.charAt(10)) !== remainder) {
    return false;
  }

  return true;
};

const isValidCNPJ = (cnpj) => {
  cnpj = cnpj.replace(/[^\d]+/g, "");

  if (cnpj.length !== 14) {
    return false;
  }

  let sum = 0;
  let remainder;
  const cnpjArray = cnpj.split("");

  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpjArray[i]) * (6 - i);
  }
  remainder = sum % 11;
  if (remainder < 2) {
    remainder = 0;
  } else {
    remainder = 11 - remainder;
  }
  if (parseInt(cnpjArray[12]) !== remainder) {
    return false;
  }

  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpjArray[i]) * (7 - i);
  }
  remainder = sum % 11;
  if (remainder < 2) {
    remainder = 0;
  } else {
    remainder = 11 - remainder;
  }
  if (parseInt(cnpjArray[13]) !== remainder) {
    return false;
  }

  return true;
};

export { isValidCPF, isValidCNPJ };

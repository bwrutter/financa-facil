/**
 * Parseia um arquivo OFX do Nubank e retorna as transações
 * @param {File} file - Arquivo OFX
 * @returns {Promise<Array>} Array de transações
 */
export const parseOfxFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            try {
                const content = event.target.result;
                const transactions = extractTransactions(content);
                resolve(transactions);
            } catch (error) {
                reject(new Error('Erro ao processar arquivo OFX: ' + error.message));
            }
        };

        reader.onerror = () => {
            reject(new Error('Erro ao ler arquivo'));
        };

        reader.readAsText(file);
    });
};

/**
 * Extrai as transações do conteúdo do arquivo OFX
 * @param {string} content - Conteúdo do arquivo OFX
 * @returns {Array} Array de transações
 */
const extractTransactions = (content) => {
    const transactions = [];
    const stmtTrnRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/g;
    let match;

    while ((match = stmtTrnRegex.exec(content)) !== null) {
        const transaction = parseTransaction(match[1]);
        if (transaction) {
            transactions.push(transaction);
        }
    }

    return transactions;
};

/**
 * Parseia uma transação individual do OFX
 * @param {string} transactionContent - Conteúdo da transação
 * @returns {Object} Objeto com os dados da transação
 */
const parseTransaction = (transactionContent) => {
    const getValue = (tag) => {
        const match = new RegExp(`<${tag}>(.*?)\n`, 'i').exec(transactionContent);
        return match ? match[1].trim() : null;
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return null;
        // Formato OFX: YYYYMMDD
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        return `${year}-${month}-${day}`;
    };

    const formatAmount = (amount) => {
        if (!amount) return 0;
        // Converte o valor para número e trata valores negativos
        return Math.abs(parseFloat(amount));
    };

    const trntype = getValue('TRNTYPE');
    const dtposted = getValue('DTPOSTED');
    const trnamt = getValue('TRNAMT');
    const fitid = getValue('FITID');
    const memo = getValue('MEMO');

    // Ignora transações de crédito (depósitos)
    if (trntype === 'CREDIT') return null;

    return {
        type: trntype,
        date: formatDate(dtposted),
        amount: formatAmount(trnamt),
        originalDescription: memo || '', // Descrição original do extrato
        description: '', // Descrição editável pelo usuário
        id: fitid,
        selected: true, // Por padrão, todas as transações são selecionadas
        name: memo || '', // Campo editável para o nome da conta
        category: '', // Campo para a categoria
    };
}; 
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Filter, XCircle } from 'lucide-react';
import BillsTable from '../components/BillsTable';
import DatePickerField from '../components/DatePickerField';
import FinanceSummary from '../components/FinanceSummary';
import NewBillModal from '../components/NewBillModal';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import Toast from '../components/Toast';
import { getBills, createBill, deleteBill, filterBillsByDateRange } from '../services/billsService';

const BillsPage = () => {
  const today = new Date().toISOString().split('T')[0];
  const sixMonthsLater = new Date();
  sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
  const sixMonthsLaterString = sixMonthsLater.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(sixMonthsLaterString);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNewBillModalOpen, setIsNewBillModalOpen] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
    setToastOpen(true);
  };

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      setLoading(true);
      const data = await getBills();
      setBills(data);
    } catch (error) {
      console.error('Error loading bills:', error);
      showToast('Erro ao carregar contas!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterBills = async () => {
    try {
      setLoading(true);
      const filteredBills = await filterBillsByDateRange(startDate, endDate);
      setBills(filteredBills);
    } catch (error) {
      console.error('Error filtering bills:', error);
      showToast('Erro ao filtrar contas!', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilter = async () => {
    setStartDate(today);
    setEndDate(sixMonthsLaterString);
    loadBills();
  };

  const handleCreateBill = async (newBill) => {
    try {
      await createBill({
        ...newBill,
        nextPayment: newBill.nextPayment
      });
      
      await loadBills();
      setIsNewBillModalOpen(false);
      showToast('Conta criada com sucesso!', 'success');
    } catch (error) {
      console.error('Error creating bill:', error);
      showToast('Erro ao criar conta!', 'error');
    }
  };

  const handleEditBill = (bill) => {
    // For now, we'll just show a toast. In a real app, we'd open an edit modal.
    showToast('Funcionalidade de edição em desenvolvimento.', 'info');
  };

  const handleDeleteClick = (bill) => {
    setBillToDelete(bill);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!billToDelete) return;
    
    try {
      await deleteBill(billToDelete.id);
      await loadBills();
      setIsDeleteModalOpen(false);
      setBillToDelete(null);
      showToast('Conta excluída com sucesso!', 'success');
    } catch (error) {
      console.error('Error deleting bill:', error);
      showToast('Erro ao excluir conta!', 'error');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-7xl mx-auto">
        <motion.header 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Contas a Pagar</h1>
          <p className="text-gray-600">Gerencie suas contas e mantenha suas finanças em dia</p>
        </motion.header>

        <FinanceSummary />

        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-5 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex gap-2">
                <motion.button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center gap-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Filter className="h-4 w-4" />
                  <span>Filtros</span>
                </motion.button>
                <motion.button 
                  className="flex items-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  onClick={() => setIsNewBillModalOpen(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Plus className="h-4 w-4" />
                  <span>CADASTRAR CONTA</span>
                </motion.button>
              </div>
              
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Buscar conta..."
                  className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            {isFilterOpen && (
              <motion.div 
                className="mt-4 py-4 border-t border-gray-100"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-wrap gap-4 items-end">
                  <DatePickerField
                    label="Data De"
                    value={startDate}
                    onChange={setStartDate}
                    className="flex-1 min-w-[200px]"
                  />
                  <DatePickerField
                    label="Data Até"
                    value={endDate}
                    onChange={setEndDate}
                    className="flex-1 min-w-[200px]"
                  />
                  
                  <div className="flex gap-2">
                    <motion.button 
                      className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      onClick={handleFilterBills}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      BUSCAR
                    </motion.button>
                    <motion.button 
                      className="py-2.5 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
                      onClick={handleClearFilter}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <XCircle className="h-4 w-4" />
                      LIMPAR FILTRO
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          
          {loading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-10 bg-gray-200 rounded"></div>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : (
            <BillsTable 
              bills={bills} 
              onEdit={handleEditBill}
              onDelete={handleDeleteClick}
            />
          )}
        </motion.div>
      </div>

      <NewBillModal 
        isOpen={isNewBillModalOpen}
        onClose={() => setIsNewBillModalOpen(false)}
        onSave={handleCreateBill}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        bill={billToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <Toast
        isOpen={toastOpen}
        type={toastType}
        message={toastMessage}
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
};

export default BillsPage;
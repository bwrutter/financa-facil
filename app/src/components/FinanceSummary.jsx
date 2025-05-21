import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, ArrowUp, Calendar, DollarSign, Wallet } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { getBills } from '../services/billsService';

const FinanceSummary = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const data = await getBills();
        setBills(data);
      } catch (error) {
        console.error('Error fetching bills:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  const totalAmount = bills.reduce((sum, bill) => sum + bill.value, 0);
  
  const today = new Date();
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(today.getDate() + 7);
  
  const upcomingBills = bills.filter(bill => {
    const paymentDate = new Date(bill.nextPayment);
    return paymentDate >= today && paymentDate <= oneWeekFromNow;
  });
  
  const upcomingTotal = upcomingBills.reduce((sum, bill) => sum + bill.value, 0);
  
  const categoryGroups = bills.reduce((acc, bill) => {
    if (!acc[bill.category]) {
      acc[bill.category] = 0;
    }
    acc[bill.category] += bill.value;
    return acc;
  }, {});
  
  let highestCategory = { name: '', value: 0 };
  Object.entries(categoryGroups).forEach(([name, value]) => {
    if (value > highestCategory.value) {
      highestCategory = { name, value };
    }
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <motion.div 
        className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm p-6 text-white"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Total Mensal</h3>
          <div className="bg-white/20 p-2 rounded-lg">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>
        <p className="text-3xl font-bold mb-1">{formatCurrency(totalAmount)}</p>
        <p className="text-blue-100 text-sm">{bills.length} contas cadastradas</p>
      </motion.div>

      <motion.div 
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Próximos 7 dias</h3>
          <div className="bg-amber-100 p-2 rounded-lg">
            <Calendar className="h-6 w-6 text-amber-600" />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-800 mb-1">{formatCurrency(upcomingTotal)}</p>
        <p className="text-gray-500 text-sm">{upcomingBills.length} contas a vencer</p>
      </motion.div>

      <motion.div 
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Maior Categoria</h3>
          <div className="bg-green-100 p-2 rounded-lg">
            <Wallet className="h-6 w-6 text-green-600" />
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-800 mb-1">
          {highestCategory.name ? highestCategory.name : "N/A"}
        </p>
        <div className="flex items-center gap-1 text-sm">
          <ArrowUp className="h-4 w-4 text-green-500" />
          <span className="text-green-600 font-medium">
            {highestCategory.value ? formatCurrency(highestCategory.value) : "-"}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default FinanceSummary;
// src/components/BillList.js
import React, { useEffect, useState } from 'react';
import { getBills } from '../services/billService';

const BillList = () => {
    const [bills, setBills] = useState([]);

    useEffect(() => {
        const fetchBills = async () => {
            try {
                const data = await getBills();
                setBills(data);
            } catch (error) {
                console.error('Error fetching bills:', error);
            }
        };

        fetchBills();
    }, []);

    return (
        <div>
            <h2>Bill List</h2>
            <ul>
                {bills.map((bill) => (
                    <li key={bill._id}>
                        {bill.name} - {bill.value}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BillList;

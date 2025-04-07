import { useState, useEffect } from 'react';
import { fetchEmployees, fetchProducts, fetchProductionRecords, startProduction, updateProductionStatus, createEmployee, createProduct, updateEmployee, deleteEmployee, updateProduct, deleteProduct } from '../services/api';
export function useProduction() {
    const [employees, setEmployees] = useState([]);
    const [products, setProducts] = useState([]);
    const [records, setRecords] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [orderNumber, setOrderNumber] = useState('');
    const [batchNumber, setBatchNumber] = useState('');
    const [productionDate, setProductionDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        async function loadInitialData() {
            try {
                setLoading(true);
                const [employeesData, productsData, recordsData] = await Promise.all([
                    fetchEmployees(),
                    fetchProducts(),
                    fetchProductionRecords()
                ]);
                setEmployees(employeesData);
                setProducts(productsData);
                setRecords(recordsData);
                if (employeesData.length > 0) {
                    setSelectedEmployee(employeesData[0].id);
                }
                if (productsData.length > 0) {
                    setSelectedProduct(productsData[0].id);
                }
            }
            catch (err) {
                console.error('Erro ao carregar dados iniciais:', err);
                setError('Não foi possível carregar os dados iniciais');
            }
            finally {
                setLoading(false);
            }
        }
        loadInitialData();
    }, []);
    async function startProductionRecord() {
        if (!selectedEmployee || !selectedProduct || !orderNumber || !batchNumber || !productionDate) {
            setError('Por favor, preencha todos os campos');
            return;
        }
        try {
            const newRecord = await startProduction({
                employee_id: selectedEmployee,
                product_id: selectedProduct,
                order_number: orderNumber,
                batch_number: batchNumber,
                production_date: productionDate,
                start_time: new Date().toISOString(),
                status: 'Em Andamento'
            });
            if (newRecord) {
                setRecords(prevRecords => [...prevRecords, newRecord]);
                // Limpar campos após iniciar produção
                setOrderNumber('');
                setBatchNumber('');
                setProductionDate('');
            }
            else {
                setError('Falha ao iniciar produção');
            }
        }
        catch (err) {
            console.error('Erro ao iniciar produção:', err);
            setError('Erro ao iniciar produção');
        }
    }
    async function updateRecordStatus(id, status) {
        try {
            const updatedRecord = await updateProductionStatus(id, status, status === 'Concluído' ? new Date().toISOString() : undefined);
            if (updatedRecord) {
                setRecords(prevRecords => prevRecords.map(record => record.id === id ? updatedRecord : record));
            }
            else {
                setError('Falha ao atualizar status da produção');
            }
        }
        catch (err) {
            console.error('Erro ao atualizar status:', err);
            setError('Erro ao atualizar status da produção');
        }
    }
    return {
        employees,
        products,
        records,
        selectedEmployee,
        selectedProduct,
        orderNumber,
        batchNumber,
        productionDate,
        loading,
        error,
        setSelectedEmployee,
        setSelectedProduct,
        setOrderNumber,
        setBatchNumber,
        setProductionDate,
        startProduction: startProductionRecord,
        updateProductionStatus: updateRecordStatus,
        createEmployee,
        createProduct,
        updateEmployee,
        deleteEmployee,
        updateProduct,
        deleteProduct
    };
}

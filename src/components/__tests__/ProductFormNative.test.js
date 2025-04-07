import { jsx as _jsx } from "react/jsx-runtime";
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { ProductFormNative } from '../ProductFormNative';
const mockOnProductAdded = jest.fn();
const mockProductService = {
    create: jest.fn().mockResolvedValue({})
};
describe('ProductFormNative', () => {
    it('should render correctly', () => {
        const { getByPlaceholderText, getByText } = render(_jsx(ProductFormNative, { onProductAdded: mockOnProductAdded }));
        expect(getByPlaceholderText('Nome do produto')).toBeTruthy();
        expect(getByText('Cadastrar')).toBeTruthy();
    });
    it('should show error when submitting empty form', async () => {
        const { getByText, queryByText } = render(_jsx(ProductFormNative, { onProductAdded: mockOnProductAdded }));
        fireEvent.press(getByText('Cadastrar'));
        await waitFor(() => {
            expect(queryByText('Por favor, insira o nome do produto')).toBeTruthy();
        });
    });
    it('should submit form successfully', async () => {
        const { getByPlaceholderText, getByText } = render(_jsx(ProductFormNative, { onProductAdded: mockOnProductAdded }));
        fireEvent.changeText(getByPlaceholderText('Nome do produto'), 'Novo Produto');
        fireEvent.press(getByText('Cadastrar'));
        await waitFor(() => {
            expect(mockProductService.create).toHaveBeenCalledWith({ name: 'Novo Produto' });
            expect(mockOnProductAdded).toHaveBeenCalled();
        });
    });
});

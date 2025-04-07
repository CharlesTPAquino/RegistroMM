interface ActionButtonsProps {
  onAddProduct: (name: string) => Promise<void>;
}

export function ActionButtons({ onAddProduct }: ActionButtonsProps) {
  return (
    <div className="mt-6 flex items-center space-x-4">
      <button 
        onClick={() => onAddProduct('New Row')}
        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        Add new row
      </button>
      <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
        Copy last week
      </button>
      <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
        Save as template
      </button>
      <div className="flex-1" />
      <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
        SUBMIT FOR APPROVAL
      </button>
    </div>
  );
}

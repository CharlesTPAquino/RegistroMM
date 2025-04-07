import { Product } from '../types';

interface TimesheetGridProps {
  products: Product[];
}

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

export function TimesheetGrid({ products }: TimesheetGridProps) {
  return (
    <div className="border rounded-lg shadow-sm">
      <div className="grid grid-cols-8 gap-px bg-gray-200">
        <div className="bg-gray-50 p-4 font-medium">Projects</div>
        {WEEKDAYS.map((day) => (
          <div key={day} className="bg-gray-50 p-4 font-medium text-center">{day}</div>
        ))}
      </div>

      <div className="divide-y divide-gray-200">
        {products.map((product) => (
          <div key={product.id} className="grid grid-cols-8 gap-px bg-gray-200">
            <div className="bg-white p-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
              {product.name}
            </div>
            {[...Array(7)].map((_, i) => (
              <div key={i} className="bg-white p-4">
                <input
                  type="text"
                  className="w-full h-8 px-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0:00"
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

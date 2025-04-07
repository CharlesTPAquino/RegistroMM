import { ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import { NavigationItem } from '../types';

interface SidebarProps {
  navigation: NavigationItem[];
}

export function Sidebar({ navigation }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="flex h-16 items-center px-4 border-b border-gray-200">
        <ClipboardDocumentListIcon className="h-8 w-8 text-blue-500" />
        <span className="ml-2 text-xl font-semibold text-gray-900">Sistema</span>
      </div>
      <nav className="space-y-1 px-2 py-4">
        {navigation.map((item) => (
          <a
            key={item.name}
            href="#"
            className={`
              flex items-center px-3 py-2 text-sm font-medium rounded-md
              ${item.current
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
            `}
          >
            <item.icon
              className={`
                mr-3 h-5 w-5
                ${item.current ? 'text-gray-500' : 'text-gray-400'}
              `}
              aria-hidden="true"
            />
            {item.name}
          </a>
        ))}
      </nav>
    </div>
  );
}

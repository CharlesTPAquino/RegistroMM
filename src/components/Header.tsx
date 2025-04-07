import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChartBarIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { Employee } from '../types';

interface HeaderProps {
  title: string;
  employees: Employee[];
}

export function Header({ title, employees }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <div className="flex items-center space-x-4">
          <Menu as="div" className="relative">
            <Menu.Button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Teammates
              <ChartBarIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
            </Menu.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                {employees.map((employee) => (
                  <Menu.Item key={employee.id}>
                    {({ active }) => (
                      <button
                        className={`
                          block w-full text-left px-4 py-2 text-sm
                          ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}
                        `}
                      >
                        {employee.name}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </Menu.Items>
            </Transition>
          </Menu>

          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            This week
            <CalendarIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}

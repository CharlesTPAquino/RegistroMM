import React, { Fragment, createContext } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { clsx } from 'clsx';

// Temporariamente usando uma versão simplificada do cn até resolver o problema de importação
function cn(...inputs: any[]) {
  return clsx(inputs);
}

// Contexto para o Dropdown
const DropdownContext = createContext<{ open: boolean }>({ open: false });

export function Dropdown({ children }: { children: React.ReactNode }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <DropdownContext.Provider value={{ open }}>
          {children}
        </DropdownContext.Provider>
      )}
    </Menu>
  );
}

interface DropdownButtonProps {
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

export function DropdownButton({
  as: Component = 'button',
  children,
  className,
  ...props
}: DropdownButtonProps & React.ComponentPropsWithoutRef<'button'>) {
  return (
    <Menu.Button
      as={Component}
      className={cn('inline-flex items-center gap-2', className)}
      {...props}
    >
      {children}
    </Menu.Button>
  );
}

interface DropdownMenuProps {
  children: React.ReactNode;
  className?: string;
  anchor?: 'top start' | 'top end' | 'bottom start' | 'bottom end';
}

export function DropdownMenu({
  children,
  className,
  anchor = 'bottom start',
  ...props
}: DropdownMenuProps) {
  const anchorClasses = {
    'top start': 'bottom-full left-0 mb-1',
    'top end': 'bottom-full right-0 mb-1',
    'bottom start': 'top-full left-0 mt-1',
    'bottom end': 'top-full right-0 mt-1',
  };

  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items
        className={cn(
          'absolute z-10 w-56 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
          anchorClasses[anchor],
          className
        )}
        {...props}
      >
        {children}
      </Menu.Items>
    </Transition>
  );
}

interface DropdownItemProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function DropdownItem({
  children,
  href,
  onClick,
  className,
  ...props
}: DropdownItemProps) {
  return (
    <Menu.Item>
      {({ active }) => {
        const Component = href ? 'a' : 'button';
        const componentProps = href ? { href } : { onClick };

        return (
          <Component
            className={cn(
              'flex w-full items-center gap-2 px-4 py-2 text-sm',
              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
              className
            )}
            {...componentProps}
            {...props}
          >
            {children}
          </Component>
        );
      }}
    </Menu.Item>
  );
}

export function DropdownLabel({ children }: { children: React.ReactNode }) {
  return <span>{children}</span>;
}

export function DropdownDivider({ className }: { className?: string }) {
  return <div className={cn('my-1 h-px bg-gray-200', className)} />;
}

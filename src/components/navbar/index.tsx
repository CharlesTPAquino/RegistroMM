import React from 'react';
import { clsx } from 'clsx';

// Temporariamente usando uma versão simplificada do cn até resolver o problema de importação
function cn(...inputs: any[]) {
  return clsx(inputs);
}

export function Navbar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <nav
      className={cn(
        'bg-white shadow-sm border-b border-gray-200 px-4 h-16 flex items-center',
        className
      )}
    >
      {children}
    </nav>
  );
}

interface NavbarItemProps {
  children: React.ReactNode;
  href?: string;
  current?: boolean;
  className?: string;
  'aria-label'?: string;
}

export function NavbarItem({
  children,
  href,
  current = false,
  className,
  ...props
}: NavbarItemProps & React.HTMLAttributes<HTMLAnchorElement | HTMLButtonElement>) {
  const Component = href ? 'a' : 'button';
  const componentProps = href ? { href } : {};

  return (
    <Component
      className={cn(
        'group inline-flex h-full items-center gap-2 px-3 py-2 text-sm font-medium transition-colors',
        current
          ? 'text-primary border-b-2 border-primary'
          : 'text-gray-600 hover:text-gray-900',
        className
      )}
      {...componentProps}
      {...props}
    >
      {children}
    </Component>
  );
}

export function NavbarLabel({ children }: { children: React.ReactNode }) {
  return <span>{children}</span>;
}

export function NavbarSection({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex h-full items-center', className)}>
      {children}
    </div>
  );
}

export function NavbarDivider({ className }: { className?: string }) {
  return (
    <div className={cn('h-5 w-px mx-2 bg-gray-200', className)} />
  );
}

export function NavbarSpacer() {
  return <div className="flex-1" />;
}

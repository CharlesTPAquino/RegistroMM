import React from 'react';
import { clsx } from 'clsx';

// Temporariamente usando uma versão simplificada do cn até resolver o problema de importação
function cn(...inputs: any[]) {
  return clsx(inputs);
}

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  initials?: string;
  square?: boolean;
}

export function Avatar({
  src,
  initials,
  square = false,
  className,
  ...props
}: AvatarProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center w-8 h-8 text-sm',
        square ? 'rounded' : 'rounded-full',
        'bg-gray-100',
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className={cn(
            'w-full h-full object-cover',
            square ? 'rounded' : 'rounded-full'
          )}
        />
      ) : (
        <span className="font-medium text-gray-600">{initials}</span>
      )}
    </div>
  );
}

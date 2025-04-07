interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  loading?: boolean;
}

export function Card({
  children,
  className = '',
  title,
  subtitle,
  icon,
  footer,
  loading
}: CardProps) {
  return (
    <div 
      className={`
        bg-white rounded-lg shadow-md overflow-hidden
        transform transition-all duration-200 hover:shadow-lg
        ${className}
      `}
    >
      {(title || subtitle || icon) && (
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex-shrink-0 text-indigo-600">
                {icon}
              </div>
            )}
            <div>
              {title && (
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-gray-500">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 relative">
        {loading ? (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
          </div>
        ) : children}
      </div>

      {footer && (
        <div className="px-4 py-3 sm:px-6 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
}

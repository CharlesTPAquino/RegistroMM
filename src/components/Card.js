import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Card({ children, className = '', title, subtitle, icon, footer, loading }) {
    return (_jsxs("div", { className: `
        bg-white rounded-lg shadow-md overflow-hidden
        transform transition-all duration-200 hover:shadow-lg
        ${className}
      `, children: [(title || subtitle || icon) && (_jsx("div", { className: "p-4 sm:p-6 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center gap-3", children: [icon && (_jsx("div", { className: "flex-shrink-0 text-indigo-600", children: icon })), _jsxs("div", { children: [title && (_jsx("h2", { className: "text-lg sm:text-xl font-bold text-gray-800", children: title })), subtitle && (_jsx("p", { className: "mt-1 text-sm text-gray-500", children: subtitle }))] })] }) })), _jsx("div", { className: "p-4 sm:p-6 relative", children: loading ? (_jsx("div", { className: "absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" }) })) : children }), footer && (_jsx("div", { className: "px-4 py-3 sm:px-6 bg-gray-50 border-t border-gray-200", children: footer }))] }));
}

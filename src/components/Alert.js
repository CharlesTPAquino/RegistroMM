import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
export function Alert({ type, message, duration = 3000, onClose }) {
    const [isVisible, setIsVisible] = useState(true);
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                onClose?.();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);
    const typeStyles = {
        success: 'bg-green-50 text-green-800 border-green-400',
        error: 'bg-red-50 text-red-800 border-red-400',
        warning: 'bg-yellow-50 text-yellow-800 border-yellow-400',
        info: 'bg-blue-50 text-blue-800 border-blue-400'
    };
    const iconMap = {
        success: (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) })),
        error: (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })),
        warning: (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) })),
        info: (_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }) }))
    };
    if (!isVisible)
        return null;
    return (_jsxs("div", { className: `
        fixed bottom-4 right-4 flex items-center p-4 rounded-lg border
        transform transition-all duration-300 shadow-lg
        ${typeStyles[type]}
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}
      `, role: "alert", children: [_jsx("div", { className: "flex-shrink-0 mr-3", children: iconMap[type] }), _jsx("div", { className: "flex-1 mr-2 text-sm font-medium", children: message }), _jsx("button", { onClick: () => {
                    setIsVisible(false);
                    onClose?.();
                }, className: "flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 transition-colors duration-200", "aria-label": "Fechar", children: _jsx("svg", { className: "w-4 h-4", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }));
}

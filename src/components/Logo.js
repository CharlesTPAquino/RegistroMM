import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import './Logo.css';
/**
 * Componente do logo da aplicação
 */
export function Logo({ size = 60, className = '' }) {
    return (_jsx("div", { className: `logo-container ${className}`, children: _jsxs("svg", { viewBox: "0 0 60 60", className: "logo-svg", style: { width: size, height: size }, children: [_jsx("rect", { width: "60", height: "60", rx: "8", className: "logo-background" }), _jsx("text", { x: "50%", y: "50%", dominantBaseline: "middle", textAnchor: "middle", className: "logo-text", children: "BLW" })] }) }));
}

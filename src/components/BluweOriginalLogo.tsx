import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';
import { styled } from '@mui/material/styles';

/**
 * Componente de logo Bluwe que renderiza o logo no formato original com fundo azul retangular
 * Usa o SvgIcon do Material UI para melhor integração com o sistema de design
 */
const StyledSvgIcon = styled(SvgIcon)(({ fontSize }) => ({
  width: fontSize === 'large' ? 60 : 40,
  height: fontSize === 'large' ? 60 : 40,
}));

export const BluweOriginalLogo: React.FC<SvgIconProps> = (props) => {
  return (
    <StyledSvgIcon
      {...props}
      viewBox="0 0 240 240"
    >
      <rect width="240" height="240" fill="#14345c" />
      <path d="M60,80 C60,80 70,80 75,80 C90,80 102,90 102,108 C102,126 90,135 75,135 C70,135 60,135 60,135 L60,160 L46,160 L46,80 L60,80 Z M60,95 L60,120 C60,120 68,120 71,120 C80,120 86,115 86,108 C86,101 80,95 71,95 C68,95 60,95 60,95 Z" fill="white" />
      <path d="M105,160 L120,80 L145,80 L160,160 L145,160 L142,142 L123,142 L120,160 L105,160 Z M127,95 L125,127 L140,127 L138,95 L127,95 Z" fill="white" />
      <path d="M162,160 L162,80 L179,80 L191,125 L203,80 L220,80 L220,160 L205,160 L205,100 L190,160 L175,100 L175,160 L162,160 Z" fill="white" />
      <path d="M223,160 L225,145 C225,145 235,150 242,150 C249,150 252,147 252,143 C252,139 249,137 242,135 C235,133 225,130 225,115 C225,100 235,90 250,90 C265,90 275,95 275,95 L273,110 C273,110 265,105 255,105 C245,105 242,109 242,113 C242,117 245,118 252,120 C259,122 270,125 270,140 C270,155 260,165 245,165 C230,165 223,160 223,160 Z" fill="white" />
    </StyledSvgIcon>
  );
};

export default BluweOriginalLogo;

import { Avatar } from './avatar';
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from './dropdown';
import { Navbar, NavbarDivider, NavbarItem, NavbarLabel, NavbarSection, NavbarSpacer } from './navbar';

// Vamos importar os ícones necessários
import { Cog8ToothIcon, UserIcon, ArrowRightStartOnRectangleIcon } from '@heroicons/react/16/solid';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

export function ExampleNavbar() {
  return (
    <Navbar>
      <Dropdown>
        <DropdownButton as={NavbarItem}>
          <Avatar src="/logo-sistema.png" />
          <NavbarLabel>Sistema de Produção</NavbarLabel>
        </DropdownButton>
        <DropdownMenu className="min-w-64" anchor="bottom start">
          <DropdownItem href="/configuracoes">
            <Cog8ToothIcon className="h-4 w-4" />
            <DropdownLabel>Configurações</DropdownLabel>
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem href="/funcionarios">
            <Avatar slot="icon" initials="FR" className="bg-blue-500 text-white" />
            <DropdownLabel>Funcionários</DropdownLabel>
          </DropdownItem>
          <DropdownItem href="/produtos">
            <Avatar slot="icon" initials="PR" className="bg-green-500 text-white" />
            <DropdownLabel>Produtos</DropdownLabel>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <NavbarDivider className="max-lg:hidden" />
      <NavbarSection className="max-lg:hidden">
        <NavbarItem href="/registros" current>
          Registros
        </NavbarItem>
        <NavbarItem href="/funcionarios">Funcionários</NavbarItem>
        <NavbarItem href="/produtos">Produtos</NavbarItem>
      </NavbarSection>
      <NavbarSpacer />
      <NavbarSection>
        <NavbarItem href="/search" aria-label="Buscar">
          <MagnifyingGlassIcon className="h-5 w-5" />
        </NavbarItem>
        <Dropdown>
          <DropdownButton as={NavbarItem}>
            <Avatar initials="US" className="bg-primary text-white" />
          </DropdownButton>
          <DropdownMenu className="min-w-64" anchor="bottom end">
            <DropdownItem href="/perfil">
              <UserIcon className="h-4 w-4" />
              <DropdownLabel>Meu perfil</DropdownLabel>
            </DropdownItem>
            <DropdownItem href="/configuracoes">
              <Cog8ToothIcon className="h-4 w-4" />
              <DropdownLabel>Configurações</DropdownLabel>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem href="/logout">
              <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
              <DropdownLabel>Sair do sistema</DropdownLabel>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarSection>
    </Navbar>
  );
}

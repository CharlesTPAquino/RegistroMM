#!/usr/bin/env pwsh

# Verificar dependências
function Test-CommandExists {
    param ($command)
    $oldPreference = $ErrorActionPreference
    $ErrorActionPreference = 'stop'
    try { if (Get-Command $command) { return $true } }
    catch { return $false }
    finally { $ErrorActionPreference = $oldPreference }
}

# Instalar dependências
function Install-Dependencies {
    # Rust
    if (-not (Test-CommandExists "rustc")) {
        Write-Host "Instalando Rust..."
        winget install Rustlang.Rust.MSVC
    }

    # PostgreSQL
    if (-not (Test-CommandExists "psql")) {
        Write-Host "Instalando PostgreSQL..."
        winget install PostgreSQL.PostgreSQL
    }

    # SQLx CLI
    cargo install sqlx-cli
}

# Configurar Banco de Dados
function Setup-Database {
    $env:DATABASE_URL = "postgres://postgres:postgres@localhost/registro_mm"
    
    # Criar banco de dados
    psql -c "CREATE DATABASE registro_mm;" -U postgres
    
    # Rodar migrations
    sqlx migrate run
}

# Configurar ambiente de desenvolvimento
function Setup-DevEnvironment {
    # Copiar .env de exemplo
    Copy-Item -Path ".env.example" -Destination ".env" -Force

    # Gerar chave secreta JWT
    $jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
    (Get-Content .env) -replace 'JWT_SECRET=.*', "JWT_SECRET=$jwtSecret" | Set-Content .env
}

# Executar testes
function Run-Tests {
    cargo test
}

# Menu principal
function Show-Menu {
    Write-Host "Configuração de Ambiente de Desenvolvimento"
    Write-Host "1. Instalar Dependências"
    Write-Host "2. Configurar Banco de Dados"
    Write-Host "3. Configurar Ambiente de Desenvolvimento"
    Write-Host "4. Executar Testes"
    Write-Host "5. Sair"

    $choice = Read-Host "Escolha uma opção"
    switch ($choice) {
        '1' { Install-Dependencies }
        '2' { Setup-Database }
        '3' { Setup-DevEnvironment }
        '4' { Run-Tests }
        '5' { return }
        default { Write-Host "Opção inválida" }
    }
}

# Executar
Show-Menu

#!/usr/bin/env pwsh

# Configurações de Produção para Registro MM

# Parâmetros de Configuração
param(
    [string]$DatabaseHost = "localhost",
    [string]$DatabasePort = "5432",
    [string]$DatabaseName = "registromm_prod",
    [string]$DatabaseUser = "registromm_user",
    [securestring]$DatabasePassword = $null,
    [string]$JwtSecretPath = "$env:USERPROFILE\.registromm\jwt_secret"
)

# Função para validar pré-requisitos
function Test-Prerequisites {
    $requirements = @{
        "cargo" = "Rust e Cargo devem estar instalados";
        "psql" = "PostgreSQL deve estar instalado";
        "docker" = "Docker é recomendado para implantação";
    }

    foreach ($cmd in $requirements.Keys) {
        if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
            Write-Warning $requirements[$cmd]
        }
    }
}

# Configurar banco de dados
function Initialize-Database {
    # Criar usuário e banco de dados
    psql -c "CREATE USER $DatabaseUser WITH PASSWORD '$DatabasePassword'"
    psql -c "CREATE DATABASE $DatabaseName OWNER $DatabaseUser"
    
    # Aplicar migrações
    sqlx migrate run
}

# Gerar segredos de produção
function New-ProductionSecrets {
    # Gerar JWT Secret
    $jwtSecret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
    
    # Criar diretório seguro
    New-Item -Path $JwtSecretPath -ItemType Directory -Force | Out-Null
    
    # Salvar segredo
    $jwtSecret | Out-File -FilePath "$JwtSecretPath\secret.key" -Encoding UTF8
    
    # Definir permissões restritas
    $acl = Get-Acl "$JwtSecretPath\secret.key"
    $rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
        [System.Security.Principal.WindowsIdentity]::GetCurrent().User,
        [System.Security.AccessControl.FileSystemRights]::FullControl,
        [System.Security.AccessControl.AccessControlType]::Allow
    )
    $acl.SetAccessRule($rule)
    $acl | Set-Acl "$JwtSecretPath\secret.key"
}

# Configurar variáveis de ambiente
function Set-ProductionEnvironment {
    [Environment]::SetEnvironmentVariable(
        "DATABASE_URL", 
        "postgres://$DatabaseUser:$DatabasePassword@$DatabaseHost:$DatabasePort/$DatabaseName", 
        "Machine"
    )
    [Environment]::SetEnvironmentVariable(
        "JWT_SECRET_PATH", 
        "$JwtSecretPath\secret.key", 
        "Machine"
    )
}

# Build e preparação para produção
function Build-ProductionRelease {
    cargo build --release
    
    # Copiar binário
    New-Item -Path ".\dist" -ItemType Directory -Force
    Copy-Item ".\target\release\registro-mm" ".\dist\registro-mm"
}

# Configurar firewall
function Set-FirewallRules {
    New-NetFirewallRule -Name "RegistroMM" -DisplayName "Registro MM" -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 8000
}

# Função principal
function Start-ProductionSetup {
    Test-Prerequisites
    Initialize-Database
    New-ProductionSecrets
    Set-ProductionEnvironment
    Build-ProductionRelease
    Set-FirewallRules

    Write-Host "Configuração de produção concluída!" -ForegroundColor Green
}

# Executar setup
Start-ProductionSetup

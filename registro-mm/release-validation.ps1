#!/usr/bin/env pwsh

# Script de Validação de Release para Registro MM

function Test-CodeQuality {
    Write-Host "🔍 Verificando qualidade do código..." -ForegroundColor Cyan
    cargo clippy -- -D warnings
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Falha na verificação de qualidade do código"
        return $false
    }
    return $true
}

function Test-CodeFormat {
    Write-Host "🧹 Verificando formatação do código..." -ForegroundColor Cyan
    cargo fmt -- --check
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Código não formatado corretamente"
        return $false
    }
    return $true
}

function Run-UnitTests {
    Write-Host "🧪 Executando testes unitários..." -ForegroundColor Cyan
    cargo test --lib
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Falha nos testes unitários"
        return $false
    }
    return $true
}

function Run-IntegrationTests {
    Write-Host "🔗 Executando testes de integração..." -ForegroundColor Cyan
    cargo test --test integration
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Falha nos testes de integração"
        return $false
    }
    return $true
}

function Run-LoadTests {
    Write-Host "⚡ Executando testes de carga..." -ForegroundColor Cyan
    cargo bench
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Falha nos testes de carga"
        return $false
    }
    return $true
}

function Run-SecurityScan {
    Write-Host "🔒 Realizando varredura de segurança..." -ForegroundColor Cyan
    cargo audit
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Vulnerabilidades de segurança encontradas"
        return $false
    }
    return $true
}

function Create-GitHubRelease {
    param(
        [string]$Version = "v1.0.0",
        [string]$Changelog = "CHANGELOG.md"
    )

    Write-Host "🏷️ Criando tag de release no GitHub..." -ForegroundColor Cyan
    
    $changelogContent = Get-Content $Changelog -Raw
    
    gh release create $Version `
        --title "Registro MM $Version" `
        --notes "$changelogContent" `
        --draft
    
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Falha ao criar release no GitHub"
        return $false
    }
    return $true
}

function Main {
    $startTime = Get-Date

    $checks = @(
        @{Name="Qualidade do Código"; Func={Test-CodeQuality}},
        @{Name="Formatação do Código"; Func={Test-CodeFormat}},
        @{Name="Testes Unitários"; Func={Run-UnitTests}},
        @{Name="Testes de Integração"; Func={Run-IntegrationTests}},
        @{Name="Testes de Carga"; Func={Run-LoadTests}},
        @{Name="Varredura de Segurança"; Func={Run-SecurityScan}},
        @{Name="Criação de Release"; Func={Create-GitHubRelease}}
    )

    $failedChecks = @()

    foreach ($check in $checks) {
        Write-Host "`n🔍 Executando: $($check.Name)" -ForegroundColor Green
        $result = & $check.Func
        if (-not $result) {
            $failedChecks += $check.Name
            Write-Host "❌ $($check.Name) - FALHOU" -ForegroundColor Red
        } else {
            Write-Host "✅ $($check.Name) - SUCESSO" -ForegroundColor Green
        }
    }

    $endTime = Get-Date
    $duration = $endTime - $startTime

    if ($failedChecks.Count -eq 0) {
        Write-Host "`n🎉 Validação de Release Concluída com Sucesso!" -ForegroundColor Green
        Write-Host "Duração: $($duration.ToString())" -ForegroundColor Cyan
        return 0
    } else {
        Write-Host "`n❌ Validação de Release Falhou" -ForegroundColor Red
        Write-Host "Verificações com falha:" -ForegroundColor Yellow
        $failedChecks | ForEach-Object { Write-Host "- $_" -ForegroundColor Yellow }
        return 1
    }
}

# Executar script
Main

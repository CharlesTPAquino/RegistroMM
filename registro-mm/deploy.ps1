#!/usr/bin/env pwsh

# Configurações de Deploy
$PROJECT_NAME = "registro-mm"
$GITHUB_REPO = "seu-usuario/registro-mm"
$BRANCH = "main"
$DEPLOY_BRANCH = "gh-pages"

# Funções de Utilitário
function Test-CommandExists {
    param ($command)
    $oldPreference = $ErrorActionPreference
    $ErrorActionPreference = 'stop'
    try { if (Get-Command $command) { return $true } }
    catch { return $false }
    finally { $ErrorActionPreference = $oldPreference }
}

# Verificar pré-requisitos
function Verify-Prerequisites {
    $requirements = @{
        "cargo" = "Rust e Cargo devem estar instalados";
        "git" = "Git deve estar instalado";
    }

    foreach ($cmd in $requirements.Keys) {
        if (-not (Test-CommandExists $cmd)) {
            Write-Error $requirements[$cmd]
            exit 1
        }
    }
}

# Build do Projeto
function Build-Project {
    cargo build --release
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Falha no build do projeto"
        exit 1
    }
}

# Preparar Artefatos de Deploy
function Prepare-DeployArtifacts {
    $deployDir = "target/deploy"
    New-Item -ItemType Directory -Force -Path $deployDir
    
    # Copiar binário
    Copy-Item "target/release/$PROJECT_NAME" $deployDir
    
    # Copiar arquivos de configuração e recursos
    Copy-Item "Cargo.toml", "README.md" $deployDir
    
    # Criar .nojekyll para GitHub Pages
    New-Item -Path "$deployDir/.nojekyll" -ItemType File
}

# Deploy para GitHub Pages
function Deploy-ToGitHubPages {
    git checkout $DEPLOY_BRANCH
    Remove-Item * -Recurse -Force
    Copy-Item "target/deploy/*" .
    
    git config user.name "GitHub Actions"
    git config user.email "actions@github.com"
    
    git add .
    git commit -m "Deploy $PROJECT_NAME - $(Get-Date)"
    git push origin $DEPLOY_BRANCH
}

# Fluxo Principal de Deploy
function Main {
    Verify-Prerequisites
    Build-Project
    Prepare-DeployArtifacts
    Deploy-ToGitHubPages
    
    Write-Host "Deploy concluído com sucesso!" -ForegroundColor Green
}

# Executar
Main

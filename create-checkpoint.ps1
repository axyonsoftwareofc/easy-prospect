# create-checkpoint.ps1
@"
# create-checkpoint.ps1 - Script para criar checkpoints rapidamente
param(
    [Parameter(Mandatory=\$true)]
    [string]\$SessionGoal,

    [Parameter(Mandatory=\$false)]
    [int]\$DurationMinutes = 60,

    [Parameter(Mandatory=\$false)]
    [string]\$NextGoal
)

\$date = Get-Date -Format "dd/MM/yyyy HH:mm"
\$checkpointFile = "CHECKPOINT_\$(Get-Date -Format 'yyyyMMdd_HHmm').md"

\$content = @"
# 🎯 Checkpoint \$(Get-Date -Format 'dd/MM/yyyy HH:mm')

## 📊 RESUMO DA SESSÃO:
- **Objetivo:** \$SessionGoal
- **Duração:** \$DurationMinutes minutos
- **Data:** \$date

## ✅ CONQUISTAS:
[Descreva o que foi concluído]

## 🚧 TRABALHO EM ANDAMENTO:
[O que não foi finalizado]

## 🐛 DESAFIOS ENCONTRADOS:
1. [Desafio 1]
2. [Desafio 2]

## 🔧 CÓDIGO IMPORTANTE:
\`\`\`typescript
// Cole snippets relevantes
\`\`\`

## 🎯 PRÓXIMOS PASSOS:
1. [Próxima tarefa 1]
2. [Próxima tarefa 2]

## 💾 ESTADO DO PROJETO:
- Branch atual: \$(git branch --show-current 2> \$null || echo "Não no git")
- Último commit: \$(git log --oneline -1 2> \$null || echo "Sem commits")

---
*Criado automaticamente em \$date*
"@

\$content | Out-File -FilePath \$checkpointFile -Encoding UTF8

Write-Host "🎉 Checkpoint criado: \$checkpointFile" -ForegroundColor Green
Write-Host "📋 Atualize PROJECT_STATUS.md com as mudanças" -ForegroundColor Yellow

# Atualizar PROJECT_STATUS.md sugerindo
if (Test-Path "PROJECT_STATUS.md") {
    Write-Host "`n📝 Lembre de atualizar PROJECT_STATUS.md com:" -ForegroundColor Cyan
    Write-Host "1. Novas funcionalidades implementadas" -ForegroundColor Gray
    Write-Host "2. Problemas resolvidos" -ForegroundColor Gray
    Write-Host "3. Próximas prioridades" -ForegroundColor Gray
}
"@ | Out-File -FilePath "create-checkpoint.ps1" -Encoding UTF8

Write-Host "✅ Script create-checkpoint.ps1 criado!" -ForegroundColor Green
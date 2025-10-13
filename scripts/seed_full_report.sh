#!/usr/bin/env bash
# Script para criar um relatório completo via curl (usa admin@example.com / clinica123!)
set -euo pipefail
BASE_URL=${BASE_URL:-http://localhost:3001}
COOKIES="/tmp/clinica_cookies.txt"

echo "Logging in..."
curl -sS -c "$COOKIES" -X POST "$BASE_URL/api/auth/login" -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"clinica123!"}' -w "\nLOGIN_STATUS:%{http_code}\n"

echo "Creating full report..."
curl -sS -b "$COOKIES" -X POST "$BASE_URL/api/reports" -H "Content-Type: application/json" -d '{"report_date":"2025-10-08","unit":"Unidade Teste Full","total_atendimentos":30,"total_indicacoes":7,"total_avaliacoes":12,"total_avaliacoes_convertidas":5,"total_reavaliacoes":4,"total_reavaliacoes_convertidas":2,"total_agendamentos_dia":18,"total_agendamentos_comparecidos":16,"total_tours":3,"contratos_recorrencia":3,"quitacao_carne_valor":900.75,"ortodontia_manutencoes":6,"ortodontia_convertidos_recorrencia":2,"vendas_planos_valor":4200.5,"renegociacoes_qtd":3,"renegociacoes_valor":600.0,"contas_recebidas":4800.25}' -w "\nCREATE_STATUS:%{http_code}\n"

echo "Done. You can inspect /api/reports to see the new entry."

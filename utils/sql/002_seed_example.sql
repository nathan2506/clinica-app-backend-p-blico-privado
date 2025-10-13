-- Seed: 002_seed_example.sql
-- Insere um usuário de exemplo e alguns relatórios diários de amostra

BEGIN;

INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin Test', 'admin@example.com', '$2b$10$8hMZ6XeHaszHX.QHG20i5uIGBd4A11GsxjX799mrRSh1qgiliZSbi', 'admin')
ON CONFLICT DO NOTHING;

INSERT INTO users (name, email, password_hash, role)
VALUES ('Clinica Test', 'clinica@example.com', '$2b$10$8hMZ6XeHaszHX.QHG20i5uIGBd4A11GsxjX799mrRSh1qgiliZSbi', 'clinica')
ON CONFLICT DO NOTHING;

INSERT INTO users (name, email, password_hash, role)
VALUES ('Assessoria Test', 'assessoria@example.com', '$2b$10$8hMZ6XeHaszHX.QHG20i5uIGBd4A11GsxjX799mrRSh1qgiliZSbi', 'assessoria')
ON CONFLICT DO NOTHING;

-- Exemplo de relatórios
INSERT INTO daily_reports (
  report_date, unit, user_id, total_atendimentos, total_indicacoes, total_avaliacoes,
  total_avaliacoes_convertidas, total_reavaliacoes, total_reavaliacoes_convertidas,
  total_agendamentos_dia, total_agendamentos_comparecidos, total_tours,
  contratos_recorrencia, quitacao_carne_valor, ortodontia_manutencoes,
  ortodontia_convertidos_recorrencia, vendas_planos_valor, renegociacoes_qtd,
  renegociacoes_valor, contas_recebidas
)
VALUES
  ('2025-10-01', 'Unidade A', 1, 20, 5, 8, 3, 2, 1, 12, 10, 2, 1, 1500.00, 3, 1, 2000.00, 2, 500.00, 2500.00),
  ('2025-10-02', 'Unidade A', 1, 18, 4, 7, 2, 1, 0, 10, 9, 1, 0, 1200.00, 2, 0, 1500.00, 1, 200.00, 1800.00)
ON CONFLICT DO NOTHING;

COMMIT;

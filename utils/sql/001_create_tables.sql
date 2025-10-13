-- Migration: 001_create_tables.sql
-- Cria as tabelas users e daily_reports

BEGIN;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS daily_reports (
  id SERIAL PRIMARY KEY,
  report_date DATE NOT NULL,
  unit TEXT,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  total_atendimentos INTEGER DEFAULT 0,
  total_indicacoes INTEGER DEFAULT 0,
  total_avaliacoes INTEGER DEFAULT 0,
  total_avaliacoes_convertidas INTEGER DEFAULT 0,
  total_reavaliacoes INTEGER DEFAULT 0,
  total_reavaliacoes_convertidas INTEGER DEFAULT 0,
  total_agendamentos_dia INTEGER DEFAULT 0,
  total_agendamentos_comparecidos INTEGER DEFAULT 0,
  total_tours INTEGER DEFAULT 0,
  contratos_recorrencia INTEGER DEFAULT 0,
  quitacao_carne_valor NUMERIC(12,2) DEFAULT 0,
  ortodontia_manutencoes INTEGER DEFAULT 0,
  ortodontia_convertidos_recorrencia INTEGER DEFAULT 0,
  vendas_planos_valor NUMERIC(12,2) DEFAULT 0,
  renegociacoes_qtd INTEGER DEFAULT 0,
  renegociacoes_valor NUMERIC(12,2) DEFAULT 0,
  contas_recebidas NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_daily_reports_date ON daily_reports(report_date);
CREATE INDEX IF NOT EXISTS idx_daily_reports_user ON daily_reports(user_id);

COMMIT;

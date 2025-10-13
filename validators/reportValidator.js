const Joi = require('joi');

const reportSchema = Joi.object({
  report_date: Joi.date().required(),
  unit: Joi.string().allow('', null),
  user_id: Joi.number().integer().optional(),
  total_atendimentos: Joi.number().integer().min(0).default(0),
  total_indicacoes: Joi.number().integer().min(0).default(0),
  total_avaliacoes: Joi.number().integer().min(0).default(0),
  total_avaliacoes_convertidas: Joi.number().integer().min(0).default(0),
  total_reavaliacoes: Joi.number().integer().min(0).default(0),
  total_reavaliacoes_convertidas: Joi.number().integer().min(0).default(0),
  total_agendamentos_dia: Joi.number().integer().min(0).default(0),
  total_agendamentos_comparecidos: Joi.number().integer().min(0).default(0),
  total_tours: Joi.number().integer().min(0).default(0),
  contratos_recorrencia: Joi.number().integer().min(0).default(0),
  quitacao_carne_valor: Joi.number().precision(2).min(0).default(0),
  ortodontia_manutencoes: Joi.number().integer().min(0).default(0),
  ortodontia_convertidos_recorrencia: Joi.number().integer().min(0).default(0),
  vendas_planos_valor: Joi.number().precision(2).min(0).default(0),
  renegociacoes_qtd: Joi.number().integer().min(0).default(0),
  renegociacoes_valor: Joi.number().precision(2).min(0).default(0),
  contas_recebidas: Joi.number().precision(2).min(0).default(0)
});

module.exports = { reportSchema };

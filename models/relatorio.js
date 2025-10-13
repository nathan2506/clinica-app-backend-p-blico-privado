const pool = require('../utils/db');

async function criarRelatorio(dados) {
  const {
    atendente,
    data,
    atendimentos,
    indicacoes,
    avaliacoes,
    avaliacoes_convertidas,
    reavaliacoes,
    reavaliacoes_convertidas,
    agendamentos_dia,
    agendamentos_comparecidos,
    tours,
    contratos_recorrencia,
    quitacao_carne,
    manutencoes,
    ortodontia_recorrente,
    vendas_planos_valor,
    renegociacoes_qtd,
    renegociacoes_valor,
    contas_recebidas
  } = dados;

  if (!atendente || !data) {
    throw new Error('Campos obrigatórios ausentes');
  }

  const query = `
    INSERT INTO relatorios (
      atendente, data, atendimentos, indicacoes, avaliacoes, avaliacoes_convertidas,
      reavaliacoes, reavaliacoes_convertidas, agendamentos_dia, agendamentos_comparecidos,
      tours, contratos_recorrencia, quitacao_carne, manutencoes, ortodontia_recorrente,
      vendas_planos_valor, renegociacoes_qtd, renegociacoes_valor, contas_recebidas
    ) VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, $9, $10,
      $11, $12, $13, $14, $15,
      $16, $17, $18, $19
    )
  `;

  const valores = [
    atendente, data, atendimentos, indicacoes, avaliacoes, avaliacoes_convertidas,
    reavaliacoes, reavaliacoes_convertidas, agendamentos_dia, agendamentos_comparecidos,
    tours, contratos_recorrencia, quitacao_carne, manutencoes, ortodontia_recorrente,
    vendas_planos_valor, renegociacoes_qtd, renegociacoes_valor, contas_recebidas
  ];

  await pool.query(query, valores);
}

module.exports = {
  criarRelatorio
};

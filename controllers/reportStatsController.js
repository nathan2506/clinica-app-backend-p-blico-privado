const pool = require('../utils/db');

async function gerarEstatisticas(req, res) {
  res.status(200).json({ mensagem: 'Rota de estatísticas funcionando!' });
}

// Retorna agregados semanais dos últimos N weeks (default 8)
async function gerarEstatisticasSemanais(req, res) {
  try {
    const weeks = Math.max(parseInt(req.query.weeks, 10) || 8, 1);
    // consideramos semanas completas. Usamos date_trunc('week', report_date) as week_start
    const query = `
      SELECT date_trunc('week', report_date)::date AS week_start,
             COALESCE(SUM(total_atendimentos),0)::int AS total_atendimentos,
             COALESCE(SUM(total_indicacoes),0)::int AS total_indicacoes,
             COALESCE(SUM(total_avaliacoes),0)::int AS total_avaliacoes,
             COALESCE(SUM(total_avaliacoes_convertidas),0)::int AS total_avaliacoes_convertidas,
             COALESCE(SUM(total_reavaliacoes),0)::int AS total_reavaliacoes,
             COALESCE(SUM(total_reavaliacoes_convertidas),0)::int AS total_reavaliacoes_convertidas,
             COALESCE(SUM(total_agendamentos_dia),0)::int AS total_agendamentos_dia,
             COALESCE(SUM(total_agendamentos_comparecidos),0)::int AS total_agendamentos_comparecidos,
             COALESCE(SUM(total_tours),0)::int AS total_tours,
             COALESCE(SUM(contratos_recorrencia),0)::int AS contratos_recorrencia,
             COALESCE(SUM(quitacao_carne_valor),0)::numeric AS quitacao_carne_valor,
             COALESCE(SUM(ortodontia_manutencoes),0)::int AS ortodontia_manutencoes,
             COALESCE(SUM(ortodontia_convertidos_recorrencia),0)::int AS ortodontia_convertidos_recorrencia,
             COALESCE(SUM(vendas_planos_valor),0)::numeric AS vendas_planos_valor,
             COALESCE(SUM(renegociacoes_qtd),0)::int AS renegociacoes_qtd,
             COALESCE(SUM(renegociacoes_valor),0)::numeric AS renegociacoes_valor,
             COALESCE(SUM(contas_recebidas),0)::numeric AS contas_recebidas
      FROM daily_reports
      WHERE report_date >= (current_date - ($1::int * 7) * interval '1 day')
      GROUP BY week_start
      ORDER BY week_start DESC
      LIMIT $1
    `;

    const result = await pool.query(query, [weeks]);
    const data = result.rows.map(r => ({
      week_start: r.week_start.toISOString().slice(0,10),
      report_date: r.week_start.toISOString().slice(0,10),
      unit: 'Agregado semanal',
      total_atendimentos: Number(r.total_atendimentos),
      total_indicacoes: Number(r.total_indicacoes),
      total_avaliacoes: Number(r.total_avaliacoes),
      total_avaliacoes_convertidas: Number(r.total_avaliacoes_convertidas),
      total_reavaliacoes: Number(r.total_reavaliacoes),
      total_reavaliacoes_convertidas: Number(r.total_reavaliacoes_convertidas),
      total_agendamentos_dia: Number(r.total_agendamentos_dia),
      total_agendamentos_comparecidos: Number(r.total_agendamentos_comparecidos),
      total_tours: Number(r.total_tours),
      contratos_recorrencia: Number(r.contratos_recorrencia),
      quitacao_carne_valor: Number(r.quitacao_carne_valor),
      ortodontia_manutencoes: Number(r.ortodontia_manutencoes),
      ortodontia_convertidos_recorrencia: Number(r.ortodontia_convertidos_recorrencia),
      vendas_planos_valor: Number(r.vendas_planos_valor),
      renegociacoes_qtd: Number(r.renegociacoes_qtd),
      renegociacoes_valor: Number(r.renegociacoes_valor),
      contas_recebidas: Number(r.contas_recebidas),
      taxa_conversao: r.total_avaliacoes ? (Number(r.total_avaliacoes_convertidas) / Number(r.total_avaliacoes)) : null
    }));

    res.status(200).json({ data, meta: { weeks } });
  } catch (err) {
    console.error('Erro gerarEstatisticasSemanais', err);
    res.status(500).json({ error: 'Erro ao gerar estatísticas semanais' });
  }
}

module.exports = {
  gerarEstatisticas,
  gerarEstatisticasSemanais
};
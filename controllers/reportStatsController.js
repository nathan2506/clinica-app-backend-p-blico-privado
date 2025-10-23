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
             COALESCE(SUM(vendas_planos_valor),0)::numeric AS vendas_planos_valor,
             COALESCE(SUM(total_avaliacoes),0)::int AS total_avaliacoes,
             COALESCE(SUM(total_avaliacoes_convertidas),0)::int AS total_avaliacoes_convertidas
      FROM daily_reports
      WHERE report_date >= (current_date - ($1::int * 7) * interval '1 day')
      GROUP BY week_start
      ORDER BY week_start DESC
      LIMIT $1
    `;

    const result = await pool.query(query, [weeks]);
    const data = result.rows.map(r => ({
      week_start: r.week_start.toISOString().slice(0,10),
      total_atendimentos: Number(r.total_atendimentos),
      vendas_planos_valor: Number(r.vendas_planos_valor),
      total_avaliacoes: Number(r.total_avaliacoes),
      total_avaliacoes_convertidas: Number(r.total_avaliacoes_convertidas),
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
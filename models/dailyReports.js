const pool = require('../utils/db');

// 📝 Salvar relatório
async function salvarRelatorio(dados) {
  const camposPermitidos = [
    'report_date',
    'unit',
    'user_id',
      'total_atendimentos',
      'total_indicacoes',
      'total_avaliacoes',
      'total_avaliacoes_convertidas',
      'total_reavaliacoes',
      'total_reavaliacoes_convertidas',
      'total_agendamentos_dia',
      'total_agendamentos_comparecidos',
      'total_tours',
      'contratos_recorrencia',
      'quitacao_carne_valor',
      'ortodontia_manutencoes',
      'ortodontia_convertidos_recorrencia',
      'vendas_planos_valor',
      'renegociacoes_qtd',
      'renegociacoes_valor',
      'contas_recebidas'
    // adicione outros campos permitidos aqui
  ];

  const campos = Object.keys(dados).filter(campo => camposPermitidos.includes(campo));
  const valores = campos.map(campo => dados[campo]);

  if (campos.length === 0) {
    throw new Error('Nenhum campo válido fornecido para inserir');
  }

  const placeholders = campos.map((_, i) => `$${i + 1}`).join(',');
  const query = `INSERT INTO daily_reports (${campos.join(',')}) VALUES (${placeholders})`;

  await pool.query(query, valores);
}

// Atualizar relatório por id
async function atualizarRelatorio(id, dados) {
  const camposPermitidos = [
    'report_date', 'unit', 'user_id', 'total_atendimentos', 'total_indicacoes',
    'total_avaliacoes', 'total_avaliacoes_convertidas', 'total_reavaliacoes',
    'total_reavaliacoes_convertidas', 'total_agendamentos_dia', 'total_agendamentos_comparecidos',
    'total_tours', 'contratos_recorrencia', 'quitacao_carne_valor', 'ortodontia_manutencoes',
    'ortodontia_convertidos_recorrencia', 'vendas_planos_valor', 'renegociacoes_qtd', 'renegociacoes_valor', 'contas_recebidas'
  ];

  const campos = Object.keys(dados).filter(c => camposPermitidos.includes(c));
  if (campos.length === 0) throw new Error('Nenhum campo válido para atualizar');

  const valores = campos.map(c => dados[c]);
  const sets = campos.map((c, i) => `${c} = $${i + 1}`).join(', ');
  const query = `UPDATE daily_reports SET ${sets}, updated_at = now() WHERE id = $${campos.length + 1}`;
  await pool.query(query, [...valores, id]);
}

// Deletar relatório por id
async function deletarRelatorio(id) {
  const query = 'DELETE FROM daily_reports WHERE id = $1';
  await pool.query(query, [id]);
}

// 📋 Listar todos os relatórios
async function listarRelatorios() {
  const resultado = await pool.query('SELECT * FROM daily_reports ORDER BY report_date DESC');
  return resultado.rows;
}

// 🔍 Executar consulta com filtros
async function executarConsulta(query, valores) {
  const resultado = await pool.query(query, valores);
  return resultado.rows;
}

// Retornar dias com relatórios em um intervalo (opcionalmente por year+month)
async function buscarDiasComRelatorios(startDate, endDate) {
  // Retorna dia do mês e quantidade de relatórios nesse dia
  const query = `
    SELECT EXTRACT(DAY FROM report_date)::int AS day,
           COUNT(*) AS count
    FROM daily_reports
    WHERE report_date BETWEEN $1 AND $2
    GROUP BY day
    ORDER BY day
  `;
  const resultado = await pool.query(query, [startDate, endDate]);
  return resultado.rows.map(r => ({ day: r.day, count: parseInt(r.count, 10) }));
}

module.exports = {
  salvarRelatorio,
  listarRelatorios,
  executarConsulta
  ,atualizarRelatorio, deletarRelatorio
  ,buscarDiasComRelatorios
};





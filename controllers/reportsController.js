const DailyReports = require('../models/dailyReports');
const xlsx = require('xlsx');
const { Parser } = require('json2csv');
const { reportSchema } = require('../validators/reportValidator');
const DailyReportsModel = require('../models/dailyReports');

async function salvarRelatorio(req, res) {
  try {
    const payload = { ...req.body };
    if (req.user && req.user.id) payload.user_id = req.user.id;
    await DailyReports.salvarRelatorio(payload);
    res.status(201).json({ mensagem: 'Relatório salvo com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar relatório:', error);
    res.status(500).json({ error: 'Erro ao salvar relatório' });
  }
}

async function listarRelatorios(req, res) {
  try {
    const { start, end, unit, user_id, page = '1', limit = '10' } = req.query;

    const filtros = [];
    const valores = [];

    // Construir filtros de forma segura usando placeholders sequenciais
    let idx = 1;
    if (start && end) {
      filtros.push(`report_date BETWEEN $${idx++} AND $${idx++}`);
      valores.push(start, end);
    }

    if (unit) {
      filtros.push(`unit = $${idx++}`);
      valores.push(unit);
    }

    if (user_id) {
      filtros.push(`user_id = $${idx++}`);
      valores.push(user_id);
    }

    const where = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';

    // total count
    const countQuery = `SELECT COUNT(*) AS total FROM daily_reports ${where}`;
    const countResult = await DailyReports.executarConsulta(countQuery, valores);
    const total = parseInt(countResult[0]?.total || 0, 10);

    // pagination
    const pg = Math.max(parseInt(page, 10) || 1, 1);
    const lim = Math.max(parseInt(limit, 10) || 10, 1);
    const offset = (pg - 1) * lim;

    const query = `SELECT * FROM daily_reports ${where} ORDER BY report_date DESC LIMIT $${idx++} OFFSET $${idx++}`;
    const queryValues = [...valores, lim, offset];

    const relatorios = await DailyReports.executarConsulta(query, queryValues);

    res.status(200).json({ data: relatorios, meta: { total, page: pg, limit: lim, totalPages: Math.ceil(total / lim) } });
  } catch (error) {
    console.error('Erro ao listar relatórios com filtros:', error);
    res.status(500).json({ error: 'Erro ao listar relatórios' });
  }
}

// Importar relatórios a partir de um arquivo XLSX/CSV (upload via multer)
async function importReports(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' });

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet, { defval: null });

    const summary = { total: rows.length, created: 0, errors: [] };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const { error, value } = reportSchema.validate(row, { abortEarly: false, stripUnknown: true });
      if (error) {
        summary.errors.push({ row: i + 1, messages: error.details.map(d => d.message) });
        continue;
      }

      try {
        await DailyReports.salvarRelatorio(value);
        summary.created += 1;
      } catch (err) {
        summary.errors.push({ row: i + 1, messages: [err.message] });
      }
    }

    res.status(200).json(summary);
  } catch (err) {
    console.error('Erro ao importar relatórios:', err);
    res.status(500).json({ error: 'Erro ao importar relatórios' });
  }
}

// Exportar relatórios em CSV (ou XLSX) com filtros similares a listarRelatorios
async function exportReports(req, res) {
  try {
    const { start, end, unit, user_id, format } = req.query;
    const filtros = [];
    const valores = [];
    let idx = 1;
    if (start && end) {
      filtros.push(`report_date BETWEEN $${idx++} AND $${idx++}`);
      valores.push(start, end);
    }
    if (unit) {
      filtros.push(`unit = $${idx++}`);
      valores.push(unit);
    }
    if (user_id) {
      filtros.push(`user_id = $${idx++}`);
      valores.push(user_id);
    }
    const where = filtros.length ? `WHERE ${filtros.join(' AND ')}` : '';
    const query = `SELECT * FROM daily_reports ${where} ORDER BY report_date DESC`;
    const relatorios = await DailyReports.executarConsulta(query, valores);

    if (format === 'xlsx') {
      const ws = xlsx.utils.json_to_sheet(relatorios);
      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, 'reports');
      const buf = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
      res.setHeader('Content-Disposition', 'attachment; filename=reports.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      return res.send(buf);
    }

    // default CSV
    if (relatorios.length === 0) return res.status(404).json({ error: 'Nenhum dado para exportar' });
    const fields = Object.keys(relatorios[0]);
    const parser = new Parser({ fields });
    const csv = parser.parse(relatorios);
    res.setHeader('Content-Disposition', 'attachment; filename=reports.csv');
    res.setHeader('Content-Type', 'text/csv');
    res.send(csv);
  } catch (err) {
    console.error('Erro ao exportar relatórios:', err);
    res.status(500).json({ error: 'Erro ao exportar relatórios' });
  }
}

async function updateReport(req, res) {
  try {
    const id = req.params.id;
    await DailyReportsModel.atualizarRelatorio(id, req.body);
    res.status(200).json({ mensagem: 'Atualizado' });
  } catch (err) {
    console.error('Erro update report', err);
    res.status(500).json({ error: 'Erro ao atualizar' });
  }
}

async function deleteReport(req, res) {
  try {
    const id = req.params.id;
    await DailyReportsModel.deletarRelatorio(id);
    res.status(200).json({ mensagem: 'Deletado' });
  } catch (err) {
    console.error('Erro delete report', err);
    res.status(500).json({ error: 'Erro ao deletar' });
  }
}

// GET /api/reports/days?year=YYYY&month=MM  OR ?start=YYYY-MM-DD&end=YYYY-MM-DD
async function getReportDays(req, res) {
  try {
    const { year, month, start, end } = req.query;

    let startDate, endDate;
    if (year && month) {
      const y = parseInt(year, 10);
      const m = parseInt(month, 10);
      if (!y || !m || m < 1 || m > 12) return res.status(400).json({ error: 'year or month invalid' });
      // start at first day, end at last day of month
      startDate = `${y}-${String(m).padStart(2, '0')}-01`;
      // compute last day
      const lastDay = new Date(y, m, 0).getDate();
      endDate = `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
    } else if (start && end) {
      startDate = start;
      endDate = end;
    } else {
      return res.status(400).json({ error: 'Provide year+month or start+end' });
    }

    const dias = await DailyReportsModel.buscarDiasComRelatorios(startDate, endDate);
    res.status(200).json({ data: dias, meta: { start: startDate, end: endDate } });
  } catch (err) {
    console.error('Erro getReportDays', err);
    res.status(500).json({ error: 'Erro ao buscar dias' });
  }
}

module.exports = {
  salvarRelatorio,
  listarRelatorios,
  importReports,
  exportReports
  ,updateReport, deleteReport
  ,getReportDays
};







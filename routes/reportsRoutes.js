const express = require('express');
const router = express.Router();
const reportsController = require('../controllers/reportsController');
const { authenticate, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { reportSchema } = require('../validators/reportValidator');
const multer = require('multer');
const upload = multer();

// POST /api/reports  -> salvar um relatório (auth + validação) - somente 'clinica' e 'admin'
router.post('/', authenticate, authorize('clinica', 'admin'), validate(reportSchema), reportsController.salvarRelatorio);

// POST /api/reports/import -> upload de xlsx/csv (auth)
router.post('/import', authenticate, upload.single('file'), reportsController.importReports);

// GET /api/reports/export -> export CSV/XLSX
router.get('/export', authenticate, reportsController.exportReports);

// PUT /api/reports/:id -> atualizar (only assessoria)
router.put('/:id', authenticate, authorize('assessoria'), validate(reportSchema), reportsController.updateReport);

// DELETE /api/reports/:id -> deletar (only assessoria)
router.delete('/:id', authenticate, authorize('assessoria'), reportsController.deleteReport);

// GET /api/reports   -> listar relatórios (aceita filtros via query)
router.get('/', reportsController.listarRelatorios);

// GET /api/reports/days -> retorna dias com relatórios em um intervalo (year+month ou start+end)
router.get('/days', reportsController.getReportDays);

module.exports = router;

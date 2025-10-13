const pool = require('../utils/db');

async function salvarTelematica(dados) {
  const {
    contacted_processes,
    contacted_services,
    contacted_machines,
    contacted_manual,
    tasks,
    tasks_manual
  } = dados;

  const query = `
    INSERT INTO telematics (
      contacted_processes, contacted_services, contacted_machines,
      contacted_manual, tasks, tasks_manual
    ) VALUES ($1, $2, $3, $4, $5, $6)
  `;

  const valores = [
    contacted_processes,
    contacted_services,
    contacted_machines,
    contacted_manual,
    tasks,
    tasks_manual
  ];

  await pool.query(query, valores);
}

module.exports = {
  salvarTelematica
};

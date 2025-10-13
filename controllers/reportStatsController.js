async function gerarEstatisticas(req, res) {
  res.status(200).json({ mensagem: 'Rota de estatísticas funcionando!' });
}

module.exports = {
  gerarEstatisticas
};
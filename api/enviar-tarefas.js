const axios = require('axios');
module.exports = async (req, res) => {
    if (req.method !== 'POST') { return res.status(405).json({ error: 'Método não permitido.' }); }
    const { taskId, tokenB, payload } = req.body;
    if (!taskId || !tokenB || !payload) { return res.status(400).json({ error: 'Payload de submissão inválido.' }); }
    const submitUrl = `https://edusp-api.ip.tv/tms/task/${taskId}/answer`;
    const headers = { 'Content-Type': 'application/json', 'accept': 'application/json', 'x-api-realm': 'edusp', 'x-api-platform': 'webclient', 'x-api-key': tokenB, 'origin': 'https://saladofuturo.educacao.sp.gov.br', 'referer': 'https://saladofuturo.educacao.sp.gov.br/' };
    try {
        const submitResponse = await axios.post(submitUrl, payload, { headers });
        if (!submitResponse.data || !submitResponse.data.id || !submitResponse.data.status) {
            return res.status(502).json({ error: "API oficial retornou resposta inválida." });
        }
        res.status(200).json(submitResponse.data);
    } catch (error) {
        const errorDetails = error.response ? JSON.stringify(error.response.data) : error.message;
        res.status(error.response?.status || 500).json({ error: `Falha ao submeter a tarefa.`, details: error.response?.data || error.message });
    }
};

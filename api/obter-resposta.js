const util = require('util');

module.exports = async (req, res) => {
    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Método não permitido.' });
        }
        const { taskId, tokenB, room } = req.body;
        if (!taskId || !tokenB || !room) {
            return res.status(400).json({ error: 'taskId, tokenB e room são obrigatórios.' });
        }

        const API_URL = "https://api.moonscripts.cloud/edusp";
        const payload = { type: "previewTask", taskId, room, token: tokenB };

        const fetchResponse = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const contentType = fetchResponse.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
             return res.status(502).json({ error: "O fornecedor de gabarito retornou uma resposta em formato inválido (ex: HTML/texto)." });
        }

        const data = await fetchResponse.json();

        if (!fetchResponse.ok || !data.answers) {
            return res.status(502).json({ error: "Fornecedor de gabarito retornou uma resposta sem o gabarito.", details: data });
        }

        res.status(200).json(data);

    } catch (error) {
        console.error("--- ERRO FATAL DETALHADO EM /api/obter-respostas ---", error);
        res.status(500).json({ 
            error: 'Falha crítica ao obter gabarito.', 
            details: {
                message: error.message,
                stack: error.stack,
                fullError: util.inspect(error, { depth: null })
            }
        });
    }
};

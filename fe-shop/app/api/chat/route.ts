export default async function Chat(req, res) {
    console.log('Received method:', req.method); // In ra phương thức HTTP nhận được

    if (req.method === 'POST') {
        const { message } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).json({ error: "Message is required" });
        }

        try {
            const response = await fetch('https://api.studio.nebius.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.NEBIUS_API_KEY}`,
                    'Accept': '*/*',
                },
                body: JSON.stringify({
                    temperature: 0.6,
                    model: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
                    messages: [
                        {
                            role: 'user',
                            content: message,
                        },
                    ],
                }),
            });

            const data = await response.json();

            if (response.ok) {
                res.status(200).json(data);
            } else {
                res.status(response.status).json({ error: data });
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' });
    }
}

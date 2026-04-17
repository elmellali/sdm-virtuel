import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Load .env from current working directory or server directory
dotenv.config()
dotenv.config({ path: './server/.env' })

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''

const app = express()
const PORT = process.env.PROXY_PORT || 3001

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }))
app.use(express.json({ limit: '10mb' }))

// Middleware to check API key
function validateApiKey(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (!OPENAI_API_KEY) {
        return res.status(500).json({ error: 'Server not configured with OpenAI API key' })
    }
    next()
}

// Structured system prompt that returns JSON with animation/expression cues
const SYSTEM_PROMPT_STRUCTURED = `Tu es un guide virtuel de l'exposition SDM (Salle Des Marchés).
Tu accueilles les visiteurs chaleureusement et réponds à leurs questions sur l'exposition, les stands, et les produits présentés.

IMPORTANT: Réponds UNIQUEMENT en JSON avec ce format exact:
{
  "text": "Ta réponse en 2-3 phrases maximum",
  "expression": "happy|neutral|thoughtful|surprised|engaged",
  "animation": "idle|talking|thinking|excited|explaining"
}

Règles:
- Utilise "happy" quand tu accueilles ou donnes de bonnes nouvelles
- Utilise "thoughtful" quand tu réfléchis ou analyses une question complexe
- Utilise "surprised" pour les révélations inattendues
- Utilise "engaged" pour les explications normales
- Utilise "neutral" pour les réponses factuelles simples
- Utilise "thinking" animation quand la question nécessite une réflexion
- Utilise "excited" pour les annonces importantes
- Utilise "explaining" quand tu donnes des détails techniques

Tu peux aussi répondre en arabe ou en anglais si le visiteur s'adresse à toi dans cette langue.`

// Proxy endpoint for chat completions
app.post('/api/chat', validateApiKey, async (req, res) => {
    try {
        const { messages, max_tokens = 150, temperature = 0.7, structured = false } = req.body

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid request: messages array required' })
        }

        const systemPrompt = structured ? SYSTEM_PROMPT_STRUCTURED : messages.find((m: any) => m.role === 'system')?.content

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: structured
                    ? [
                        { role: 'system', content: SYSTEM_PROMPT_STRUCTURED },
                        ...messages.filter((m: any) => m.role !== 'system'),
                      ]
                    : messages,
                max_tokens,
                temperature,
                response_format: structured ? { type: 'json_object' } : undefined,
            }),
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({}))
            return res.status(response.status).json({
                error: error?.error?.message || 'OpenAI API error',
            })
        }

        const data = await response.json()
        res.json(data)
    } catch (error) {
        console.error('Chat proxy error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Proxy endpoint for audio transcription
app.post('/api/transcribe', validateApiKey, async (req, res) => {
    try {
        const base64Audio = req.body.audio

        if (!base64Audio) {
            return res.status(400).json({ error: 'Audio data required' })
        }

        const actualType = req.body.type || 'audio/webm'
        const extension = actualType.includes('ogg') ? 'ogg' : 'webm'

        // Decode base64 to Buffer
        const audioBuffer = Buffer.from(base64Audio, 'base64')

        const formData = new FormData()
        // Use a generic filename with the correct detected extension
        formData.append('file', new Blob([audioBuffer], { type: actualType }), `audio.${extension}`)
        formData.append('model', 'whisper-1')
        // Remove language lock to allow auto-detection which prevents "Merci" hallucinations
        formData.append('prompt', 'SDM exhibition, Salle Des Marchés, finance, technological innovation.')

        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: formData,
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({}))
            return res.status(response.status).json({
                error: error?.error?.message || 'OpenAI API error',
            })
        }

        const data = await response.json()
        res.json(data)
    } catch (error) {
        console.error('Transcription proxy error:', error)
        res.status(500).json({ error: 'Internal server error' })
    }
})

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', hasApiKey: !!OPENAI_API_KEY })
})

app.listen(PORT, () => {
    console.log(`✅ SDM AI Proxy server running on port ${PORT}`)
    console.log(`   API Key configured: ${!!OPENAI_API_KEY}`)
})

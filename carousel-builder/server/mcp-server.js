import { createServer } from 'node:http';
import Anthropic from '@anthropic-ai/sdk';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const IS_MCP = process.argv.includes('--mcp');
const PORT = 3456;

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from env

const SYSTEM_PROMPT = `Você é estrategista de conteúdo especializado em Instagram editorial.
Crie carrosséis no estilo dark-luxury: direto, inteligente, provocativo mas refinado.
Tom editorial, em português brasileiro.
RESPONDA APENAS COM JSON VÁLIDO. Sem markdown, sem backticks, sem texto extra.`;

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function json(res, data, status = 200) {
  cors(res);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

async function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(body || '{}'));
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// ─── API functions ────────────────────────────────────────────────────────────

async function generateCarousel({ topic, audience, slideCount = 8, cta }) {
  const userPrompt = `Crie um carrossel de Instagram com ${slideCount} slides sobre: "${topic}".
Audiência: ${audience || 'geral'}.
CTA final: ${cta || 'Siga para mais conteúdo'}.

Regras obrigatórias:
- Primeiro slide: template "cover"
- Último slide: template "cta"
- Não repetir o mesmo template em sequência (exceto "dark")
- Variar entre: dark, steps, overlay, split

Templates e campos por tipo:
- cover:   { template, headline, headline_italic, body }
- split:   { template, headline, headline_italic, body }
- dark:    { template, section_number, section_title, body, list_items (array máx 4), conclusion }
- steps:   { template, section_title (pode ser null), steps (array {label,text} máx 4), call_to_action, call_to_action_italic }
- overlay: { template, section_number, section_title, headline, body }
- cta:     { template, headline, headline_italic, body, cta_text, cta_word, cta_suffix }

Retorne SOMENTE o JSON: { "slides": [...] }`;

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const raw = msg.content[0].text;
  try { return JSON.parse(raw); }
  catch { throw new Error(`Claude returned non-JSON response: ${raw.slice(0, 200)}`); }
}

async function refineSlide({ slide, instruction }) {
  const userPrompt = `Refine este slide de Instagram mantendo o template "${slide.template}" e a estrutura dos campos.
Instrução: "${instruction}"

Slide atual:
${JSON.stringify(slide, null, 2)}

Retorne SOMENTE o JSON do slide atualizado, com os mesmos campos do template "${slide.template}".`;

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const raw = msg.content[0].text;
  try { return JSON.parse(raw); }
  catch { throw new Error(`Claude returned non-JSON response: ${raw.slice(0, 200)}`); }
}

async function brainstormIdeas({ niche, platform = 'Instagram', count = 5 }) {
  const userPrompt = `Sugira ${count} temas de alto engajamento para carrosséis de ${platform} no nicho: "${niche}".
Para cada tema: título provocativo, ângulo editorial único, e por que engaja.

Retorne SOMENTE o JSON: { "ideas": [{ "title": "...", "angle": "...", "why": "..." }] }`;

  const msg = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const raw = msg.content[0].text;
  try { return JSON.parse(raw); }
  catch { throw new Error(`Claude returned non-JSON response: ${raw.slice(0, 200)}`); }
}

// ─── HTTP Bridge mode ─────────────────────────────────────────────────────────

async function handleRequest(req, res) {
  if (req.method === 'OPTIONS') {
    cors(res);
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const body = await readBody(req);
      if (req.url === '/generate') return json(res, await generateCarousel(body));
      if (req.url === '/refine')   return json(res, await refineSlide(body));
      if (req.url === '/brainstorm') return json(res, await brainstormIdeas(body));
    } catch (e) {
      return json(res, { error: e.message }, 500);
    }
  }

  json(res, { error: 'Not found' }, 404);
}

// ─── MCP stdio mode ───────────────────────────────────────────────────────────

if (IS_MCP) {
  const server = new Server(
    { name: 'carousel-builder', version: '0.1.0' },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: 'generate_carousel',
        description: 'Gera um carrossel completo de Instagram no estilo dark-luxury com 3 a 12 slides.',
        inputSchema: {
          type: 'object',
          properties: {
            topic:      { type: 'string', description: 'Tema ou assunto do carrossel' },
            audience:   { type: 'string', description: 'Audiência-alvo' },
            slideCount: { type: 'number', description: 'Número de slides (3–12, default 8)', default: 8 },
            cta:        { type: 'string', description: 'Chamada para ação no slide final' },
          },
          required: ['topic'],
        },
      },
      {
        name: 'refine_slide',
        description: 'Reescreve um slide mantendo o template e a estrutura dos campos.',
        inputSchema: {
          type: 'object',
          properties: {
            slide:       { type: 'object', description: 'Objeto JSON do slide atual' },
            instruction: { type: 'string', description: 'Instrução de refinamento' },
          },
          required: ['slide', 'instruction'],
        },
      },
      {
        name: 'brainstorm_ideas',
        description: 'Sugere temas de alto engajamento para carrosséis de Instagram em um nicho.',
        inputSchema: {
          type: 'object',
          properties: {
            niche:    { type: 'string', description: 'Nicho ou área de atuação' },
            platform: { type: 'string', description: 'Plataforma (default: Instagram)', default: 'Instagram' },
            count:    { type: 'number', description: 'Número de ideias (default: 5)', default: 5 },
          },
          required: ['niche'],
        },
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
      let result;
      if (name === 'generate_carousel')   result = await generateCarousel(args);
      else if (name === 'refine_slide')   result = await refineSlide(args);
      else if (name === 'brainstorm_ideas') result = await brainstormIdeas(args);
      else throw new Error(`Unknown tool: ${name}`);

      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    } catch (e) {
      return {
        content: [{ type: 'text', text: `Error: ${e.message}` }],
        isError: true,
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
} else {
  const server = createServer(handleRequest);
  server.listen(PORT, () => {
    process.stdout.write(`Carousel Builder bridge running on http://localhost:${PORT}\n`);
  });
}

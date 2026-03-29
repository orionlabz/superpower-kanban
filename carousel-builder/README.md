# carousel-builder

Editor visual local para criar carrosséis de Instagram no estilo editorial dark-luxury.

**Versão:** 0.3.0

## Componentes

| Componente | Descrição |
|---|---|
| MCP tools | `generate_carousel`, `refine_slide`, `brainstorm_ideas` — auto-registrados no Claude Code |
| HTTP bridge | `localhost:37776` — alimenta o web app visual |
| Web app | Editor de slides com preview em tempo real |
| CLI `carousel` | Gerencia o bridge de qualquer diretório |

## Instalação

### Via plugin do Claude Code

Após instalar o plugin, execute o hook de instalação uma vez:

```bash
bash ~/.claude/plugins/marketplaces/orionlabz/carousel-builder/hooks/post-install.sh
```

Isso instala as dependências do servidor (`npm install`) e cria o comando `carousel` em `~/.local/bin/carousel`.

Se `~/.local/bin` não estiver no PATH, adicione ao seu `~/.zshrc` ou `~/.bashrc`:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

### Via curl (standalone)

```bash
curl -fsSL https://raw.githubusercontent.com/orionlabz/orionlabz/main/carousel-builder/install.sh | bash
```

## Atualização

O sistema de plugins do Claude Code **não executa** scripts de lifecycle automaticamente. Após atualizar o plugin, rode manualmente:

```bash
bash ~/.claude/plugins/marketplaces/orionlabz/carousel-builder/hooks/post-update.sh
```

Isso reinstala as dependências com a versão atualizada.

## CLI — carousel

```bash
carousel start    # sobe o bridge em background e abre o browser
carousel stop     # encerra o bridge
carousel status   # mostra PID, porta e uptime
carousel logs     # tail em tempo real do log
```

## Usar as ferramentas no Claude Code

O MCP server é registrado automaticamente via `.mcp.json`. As ferramentas ficam disponíveis em toda sessão do Claude Code, independente do bridge estar rodando.

Ferramentas disponíveis: `generate_carousel`, `refine_slide`, `brainstorm_ideas`.

Para registrar manualmente:

```bash
claude mcp add carousel-builder -s user -- node ~/.claude/plugins/marketplaces/orionlabz/carousel-builder/server/mcp-server.js --mcp
```

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `ANTHROPIC_API_KEY` | Sim | Usada pelo bridge HTTP e pelo MCP server |

## Templates de slide

| Template | Uso | Tem foto |
|---|---|---|
| `cover` | Primeiro slide (sempre) | ✅ |
| `split` | Introdução/contexto com foto | ✅ |
| `dark` | Conteúdo puro — pilares, seções | ❌ |
| `steps` | Etapas sequenciais | ❌ |
| `overlay` | Seção com foto de impacto | ✅ |
| `cta` | Último slide (sempre) | ❌ |

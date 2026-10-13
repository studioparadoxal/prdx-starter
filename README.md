# PRDX Starter

Repositório base do Studio Paradoxal para sites e landing pages. Todo projeto novo nasce daqui.

**Stack:** Astro 7 · Cloudflare Workers · GSAP (ScrollTrigger + SplitText) · Lenis · TypeScript

## Comandos

| Comando | O que faz |
|---|---|
| `npm install` | Instala as dependências (só na primeira vez) |
| `npm run dev` | Abre o site local em `localhost:4321`, atualizando a cada alteração salva |
| `npm run build` | Gera a versão final em `dist/` |
| `npm run preview` | Roda o build final localmente, simulando a Cloudflare |
| `npm run deploy` | Build + publicação direta via Wrangler (o caminho padrão é o Workers Builds, por push no GitHub) |

## Estrutura

```
src/
  styles/tokens.css    ← cores, tipografia, espaços. Troque aqui por cliente.
  styles/global.css    ← base visual de todo site (reset, grid, estados de animação)
  layouts/Base.astro   ← esqueleto da página: SEO, fontes, scripts
  sections/            ← blocos grandes de página (hero, cases, serviços, rodapé)
  components/          ← peças menores reutilizáveis (botão, card, marquee)
  scripts/motion.ts    ← Lenis + GSAP, ativados por atributos no HTML
  pages/               ← cada arquivo vira uma URL
public/                ← arquivos servidos como estão (favicon, og.png, vídeos)
astro.config.mjs       ← adapter Cloudflare + fontes
wrangler.jsonc         ← configuração do Worker na Cloudflare
```

## Fontes

Configuradas em `astro.config.mjs` pela Fonts API do Astro: baixadas do Google no build e servidas pelo próprio domínio. Para trocar, edite o `name` e mantenha o `cssVariable`.

## Animação sem escrever JavaScript

```html
<h2 data-reveal="lines">Título revelado linha a linha</h2>
<p data-reveal>Aparece subindo ao entrar na tela</p>
<img data-parallax="0.15" … />
```

Usuários com "reduzir movimento" ativado no sistema veem tudo estático.

## Novo projeto de cliente

1. No GitHub: **Use this template** → novo repositório com o nome do cliente
2. Trocar `tokens.css`, fontes no `astro.config.mjs`, `name` no `wrangler.jsonc` e `site`
3. Na Cloudflare: Workers & Pages → Create → Import a repository → selecionar o repo
4. A cada push na `main`, o site atualiza. Cada branch gera uma preview URL.

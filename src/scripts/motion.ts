/*
 * Motor de movimento e interações do starter.
 * Lenis = scroll suave. GSAP + ScrollTrigger = animações ligadas ao scroll.
 * SplitText = recorta textos em linhas, palavras ou letras para animar.
 *
 * Atributos reutilizáveis (funcionam em qualquer página, sem escrever JS):
 *   data-reveal            → aparece subindo ao entrar na tela
 *   data-reveal="lines"    → título revelado linha a linha
 *   data-parallax="0.15"   → desloca no scroll (velocidade relativa)
 *   data-highlight         → palavras "acendem" conforme o scroll
 *   data-mutate            → peso da fonte variável reage ao cursor
 *   data-copy="texto"      → botão que copia o texto para a área de transferência
 *   data-clock             → hora ao vivo de São Paulo
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const $$ = <T extends HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel);

export function initMotion() {
  // Interações que não são movimento: valem para todo mundo
  initClock();
  initCopy();

  if (reduced) return;

  const lenis = new Lenis({ lerp: 0.1, anchors: { offset: -56 } });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  initReveal();
  initParallax();
  initReel();
  if (finePointer) initCasePreview();

  // Tudo que mede texto espera as fontes, senão as linhas são calculadas com a fonte reserva
  document.fonts.ready.then(() => {
    initLines();
    initHighlight();
    initMutate();
    initWordmark();
    ScrollTrigger.refresh();
  });
}

function initReveal() {
  $$('[data-reveal]:not([data-reveal="lines"])').forEach((el) => {
    // O que já está na primeira tela entra junto com o carregamento; o resto, no scroll
    const inFirstView = el.getBoundingClientRect().top < window.innerHeight;
    gsap.fromTo(el, { autoAlpha: 0, y: 32 }, {
      autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out',
      ...(inFirstView
        ? { delay: 0.4 }
        : { scrollTrigger: { trigger: el, start: 'top 90%', once: true } }),
    });
  });
}

function initLines() {
  $$('[data-reveal="lines"]').forEach((el) => {
    gsap.set(el, { autoAlpha: 1 });
    SplitText.create(el, {
      type: 'lines', mask: 'lines', linesClass: 'split-line', autoSplit: true,
      onSplit: (self) => gsap.from(self.lines, {
        yPercent: 110, duration: 1.1, ease: 'power4.out', stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      }),
    });
  });
}

function initParallax() {
  $$('[data-parallax]').forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || '0.15');
    gsap.to(el, {
      yPercent: -100 * speed, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

/*
 * ASSINATURA: título com fonte variável que "muta".
 * Na entrada, as letras sobem uma a uma. Depois, cada letra ganha peso
 * conforme a distância do cursor (mais perto = mais pesada).
 * Em telas de toque, o peso respira sozinho numa onda lenta.
 */
function initMutate() {
  $$('[data-mutate]').forEach((el) => {
    gsap.set(el, { autoAlpha: 1 });
    const split = SplitText.create(el.querySelectorAll('.hero__line'), { type: 'chars', mask: 'chars', charsClass: 'split-char', aria: 'hidden' });
    const chars = split.chars as HTMLElement[];
    const MIN = 200, MAX = 900, BASE = 400, RADIUS = 260;

    // Trava a largura de cada letra (em "em", acompanha o tamanho da fonte) no peso base.
    // Assim a mudança de peso só redesenha a letra, sem empurrar as vizinhas:
    // zero layout shift (CLS), que o Google mede nos Core Web Vitals.
    const fontSize = parseFloat(getComputedStyle(el).fontSize);
    chars.forEach((c) => {
      c.style.width = `${c.getBoundingClientRect().width / fontSize}em`;
      c.style.textAlign = 'center';
    });

    const weights = chars.map(() => ({ w: BASE }));
    const render = () => chars.forEach((c, i) => { c.style.fontVariationSettings = `'wght' ${weights[i].w.toFixed(0)}`; });

    gsap.from(chars, {
      yPercent: 110, duration: 1.2, ease: 'power4.out', stagger: 0.025, delay: 0.15,
      onComplete: () => {
        // Depois da entrada, libera a máscara para a letra mais pesada poder crescer além da caixa
        split.masks.forEach((m) => { (m as HTMLElement).style.overflow = 'visible'; });
        finePointer ? followPointer() : breathe();
      },
    });

    function followPointer() {
      const setters = weights.map((w) => gsap.quickTo(w, 'w', { duration: 0.6, ease: 'power3.out', onUpdate: render }));
      window.addEventListener('pointermove', (e) => {
        chars.forEach((c, i) => {
          const r = c.getBoundingClientRect();
          const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
          const t = Math.max(0, 1 - d / RADIUS);
          setters[i](MIN + (MAX - MIN) * (0.28 + 0.72 * t * t) * (d > RADIUS ? 0.45 : 1));
        });
      }, { passive: true });
    }

    function breathe() {
      gsap.to(weights, {
        w: MAX, duration: 1.6, ease: 'sine.inOut', repeat: -1, yoyo: true,
        stagger: { each: 0.06, from: 'start' }, onUpdate: render,
      });
    }
  });
}

/* Showreel: o recorte do vídeo se abre até a tela cheia, preso à rolagem (scrub) */
function initReel() {
  const reel = document.querySelector<HTMLElement>('[data-reel]');
  const frame = reel?.querySelector<HTMLElement>('[data-reel-frame]');
  if (!reel || !frame) return;
  // Mesmo recorte inicial do CSS, escrito com os 4 lados para o GSAP interpolar lado a lado
  const start = window.matchMedia('(max-width: 640px)').matches ? 'inset(30% 8% 30% 8%)' : 'inset(22% 30% 22% 30%)';
  gsap.fromTo(frame, { clipPath: start }, {
    clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
    scrollTrigger: { trigger: reel, start: 'top top', end: 'bottom bottom', scrub: true },
  });
  // Vídeo só toca quando está visível: economiza bateria e processamento
  const video = frame.querySelector('video');
  if (video) {
    ScrollTrigger.create({
      trigger: reel, start: 'top bottom', end: 'bottom top',
      onToggle: (self) => (self.isActive ? video.play().catch(() => {}) : video.pause()),
    });
  }
}

/* Manifesto: cada palavra passa de cinza claro a escuro conforme a leitura avança */
function initHighlight() {
  const css = getComputedStyle(document.documentElement);
  // Ponto de partida legível (contraste mínimo 3:1 para texto grande), para o efeito não esconder conteúdo
  const from = css.getPropertyValue('--color-text-faint').trim();
  const to = css.getPropertyValue('--color-text-strong').trim();
  $$('[data-highlight]').forEach((el) => {
    const split = SplitText.create(el, { type: 'words', aria: 'none' });
    gsap.fromTo(split.words, { color: from }, {
      color: to, ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true },
    });
  });
}

/* Rodapé: as letras da palavra gigante sobem conforme o fim da página se aproxima */
function initWordmark() {
  const el = document.querySelector<HTMLElement>('[data-wordmark]');
  if (!el) return;
  const split = SplitText.create(el, { type: 'chars', mask: 'chars', charsClass: 'split-char', aria: 'hidden' });
  gsap.from(split.chars, {
    yPercent: 100, ease: 'none', stagger: 0.05,
    scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: true },
  });
}

/* Cases: imagem que segue o cursor sobre a lista */
function initCasePreview() {
  const preview = document.querySelector<HTMLElement>('[data-case-preview]');
  const list = document.querySelector<HTMLElement>('[data-cases]');
  if (!preview || !list) return;
  const x = gsap.quickTo(preview, 'x', { duration: 0.6, ease: 'power3.out' });
  const y = gsap.quickTo(preview, 'y', { duration: 0.6, ease: 'power3.out' });
  const w = () => preview.offsetWidth, h = () => preview.offsetHeight;

  list.addEventListener('pointermove', (e) => { x(e.clientX - w() / 2); y(e.clientY - h() / 2); });
  list.querySelectorAll<HTMLElement>('[data-case]').forEach((item) => {
    item.addEventListener('pointerenter', () => {
      preview.style.setProperty('--tone', item.dataset.tone || '');
      preview.classList.add('is-active');
    });
  });
  list.addEventListener('pointerleave', () => preview.classList.remove('is-active'));
}

function initClock() {
  const els = document.querySelectorAll<HTMLElement>('[data-clock]');
  if (!els.length) return;
  const fmt = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
  const tick = () => els.forEach((el) => { el.textContent = fmt.format(new Date()); });
  tick();
  setInterval(tick, 10_000);
}

function initCopy() {
  document.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
    const label = btn.querySelector<HTMLElement>('[data-copy-label]') ?? btn;
    const original = label.textContent;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy || '');
        label.textContent = 'E-mail copiado';
      } catch {
        label.textContent = 'Não deu para copiar. Selecione o texto.';
      }
      setTimeout(() => { label.textContent = original; }, 1800);
    });
  });
}

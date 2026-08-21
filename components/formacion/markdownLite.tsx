import type { ReactNode } from 'react';

// Parser deliberadamente mínimo — solo cubre lo que el catálogo de cursos
// realmente produce (## encabezados, **negrita**, listas -, [texto](url)).
// No es un motor de markdown genérico.

type Block =
  | { t: 'h2'; text: string }
  | { t: 'ul'; items: string[] }
  | { t: 'ol'; items: string[] }
  | { t: 'p'; text: string };

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      nodes.push(
        <a
          key={`${keyPrefix}-l${i}`}
          href={m[2]}
          target="_blank"
          rel="noreferrer"
          style={{ color: 'var(--accent-strong)', textDecoration: 'underline' }}
        >
          {m[1]}
        </a>,
      );
    } else {
      nodes.push(<b key={`${keyPrefix}-b${i}`}>{m[3]}</b>);
    }
    last = regex.lastIndex;
    i++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function parseBlocks(md: string): Block[] {
  const lines = (md || '').split('\n');
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^##\s+/.test(line)) {
      blocks.push({ t: 'h2', text: line.replace(/^##\s+/, '') });
      i++;
      continue;
    }
    if (/^#\s+/.test(line)) {
      i++;
      continue;
    }
    if (/^-\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^-\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^-\s+/, ''));
        i++;
      }
      blocks.push({ t: 'ul', items });
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''));
        i++;
      }
      blocks.push({ t: 'ol', items });
      continue;
    }
    if (line.trim() === '') {
      i++;
      continue;
    }
    const para = [line];
    i++;
    while (i < lines.length && lines[i].trim() !== '' && !/^#|^-\s|^\d+\.\s/.test(lines[i])) {
      para.push(lines[i]);
      i++;
    }
    blocks.push({ t: 'p', text: para.join(' ') });
  }
  return blocks;
}

export function MarkdownLite({ md }: { md: string }) {
  const blocks = parseBlocks(md);
  return (
    <div>
      {blocks.map((b, idx) => {
        if (b.t === 'h2') {
          return (
            <h4
              key={idx}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.35rem',
                color: 'var(--accent-strong)',
                marginTop: idx === 0 ? 0 : 22,
                marginBottom: 10,
              }}
            >
              {b.text}
            </h4>
          );
        }
        if (b.t === 'ul' || b.t === 'ol') {
          const Tag = b.t === 'ul' ? 'ul' : 'ol';
          return (
            <Tag key={idx} style={{ margin: '0 0 8px 20px', display: 'grid', gap: 8 }}>
              {b.items.map((it, j) => (
                <li key={j} style={{ fontSize: '1rem', lineHeight: 1.65, color: 'rgba(255,255,255,.82)' }}>
                  {renderInline(it, `${idx}-${j}`)}
                </li>
              ))}
            </Tag>
          );
        }
        return (
          <p key={idx} style={{ fontSize: '1rem', lineHeight: 1.75, color: 'rgba(255,255,255,.82)', marginBottom: 14 }}>
            {renderInline(b.text, String(idx))}
          </p>
        );
      })}
    </div>
  );
}

export interface Slide {
  titulo: string;
  body: string;
}

// Cada ## del cuerpo se convierte en una diapositiva propia — una idea por
// pantalla, en vez de un bloque largo de texto.
export function parseSlides(cuerpo: string): Slide[] {
  const lines = (cuerpo || '').split('\n');
  const slides: Slide[] = [];
  let current: Slide | null = null;
  for (const raw of lines) {
    if (/^##\s+/.test(raw)) {
      if (current) slides.push(current);
      current = { titulo: raw.replace(/^##\s+/, ''), body: '' };
    } else if (/^#\s+/.test(raw)) {
      continue;
    } else if (current) {
      current.body += raw + '\n';
    }
  }
  if (current) slides.push(current);
  return slides.length ? slides : [{ titulo: '', body: cuerpo || '' }];
}

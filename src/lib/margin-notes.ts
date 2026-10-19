// src/lib/margin-notes.ts
// Build-time half of the handwritten margin notes. Each footnote reference
// gets a hand-drawn ring and a hidden copy of its footnote, placed right after
// the reference and split into words. MarginNotes (client) opens the copy
// beside the text and writes it in. The footnote list at the end of the post
// stays, with the site's return arrow in place of the ↩ emoji.

type HastNode = {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  value?: string;
  children?: HastNode[];
};

// Phrasing elements kept as they are inside a note; anything else becomes a span.
const INLINE_TAGS = new Set(['a', 'em', 'strong', 'b', 'i', 'code', 'del', 's', 'sub', 'sup', 'mark', 'br', 'img']);
const BLOCK_TAGS = new Set(['p', 'ul', 'ol', 'li', 'blockquote', 'pre', 'div', 'figure', 'figcaption', 'table']);

// Loose loops that overshoot where they started, like a pen circling a
// number: one around the number in the text, one around it in the note.
const RING_PATH = 'M30 4.5C22 1.5 7 3 4 12C1.5 20 10 27 21 26.5C32 26 38 19 36 11C34.5 5 27 3 17 4.6';
const NOTE_RING_PATH = 'M24 3.5C14 2 4.5 6.5 4 14.5C3.5 22.5 12 27.5 21.5 26.5C31 25.5 37 19.5 36 12C35 5.5 27.5 2.5 19 4';

// The site's return arrow (the one beside "writes" in the rail), for the
// footnote list's links back to the text.
const RETURN_PATH = 'M5.5 4L1.5 8M1.5 8L5.5 12M1.5 8H10C11.3807 8 12.5 6.88071 12.5 5.5V5.5C12.5 4.11929 11.3807 3 10 3H8.5';

const el = (tagName: string, properties: Record<string, unknown>, children: HastNode[] = []): HastNode => ({
  type: 'element',
  tagName,
  properties,
  children,
});

const word = (value: string): HastNode => el('span', { className: ['fn-w'] }, [{ type: 'text', value }]);

const ring = (className: string, d: string): HastNode =>
  el('svg', { className: [className], viewBox: '0 0 40 30', ariaHidden: 'true', focusable: 'false' }, [
    el('path', { d, pathLength: 1 }),
  ]);

const isFootnoteList = (node: HastNode) =>
  node.tagName === 'section' && node.properties?.dataFootnotes !== undefined;

// Wrap every word in a span so the client can write the note in word by word.
// Words stay whole, so the font's contextual alternates still apply.
function splitWords(node: HastNode): HastNode[] {
  if (node.type === 'text') {
    return (node.value ?? '').split(/(\s+)/).filter(Boolean).map((part) =>
      /^\s+$/.test(part) ? { type: 'text', value: ' ' } : word(part)
    );
  }
  if (node.type !== 'element' || !node.tagName) return [];
  if (node.properties?.dataFootnoteBackref !== undefined) return [];
  if (node.properties?.dataFootnoteRef !== undefined) return [];
  if (node.tagName === 'img') {
    return [{ ...node, properties: { ...node.properties, className: ['fn-w', 'fn-img'] } }];
  }
  const children = (node.children ?? []).flatMap(splitWords);
  if (INLINE_TAGS.has(node.tagName)) return [{ ...node, children }];
  return [el('span', {}, children)];
}

// Footnote blocks (paragraphs, lists) flattened into one inline run,
// with a line break between blocks.
function noteContent(item: HastNode): HastNode[] {
  const blocks = (item.children ?? []).filter((child) => child.type !== 'text' || child.value?.trim());
  const out: HastNode[] = [];
  blocks.forEach((block, index) => {
    if (index > 0) out.push(el('br', {}));
    const inner = block.type === 'element' && BLOCK_TAGS.has(block.tagName ?? '') ? block.children ?? [] : [block];
    out.push(...inner.flatMap(splitWords));
  });
  // Drop the space the removed back-reference leaves at the end.
  while (out.length && out[out.length - 1].type === 'text') out.pop();
  return out;
}

export default function rehypeMarginNotes() {
  return (tree: HastNode) => {
    const items = new Map<string, HastNode>();
    const findItems = (node: HastNode) => {
      if (node.tagName === 'li' && typeof node.properties?.id === 'string') items.set(node.properties.id, node);
      node.children?.forEach(findItems);
    };
    const returnArrow = (node: HastNode) => {
      if (node.properties?.dataFootnoteBackref !== undefined) {
        node.children = (node.children ?? []).map((child) =>
          child.type === 'text' && child.value?.trim() === '↩'
            ? el('svg', { className: ['fn-back'], viewBox: '0 0 14 14', ariaHidden: 'true', focusable: 'false' }, [
                el('path', { d: RETURN_PATH }),
              ])
            : child
        );
      }
      node.children?.forEach(returnArrow);
    };
    const walk = (node: HastNode) => {
      if (isFootnoteList(node)) {
        findItems(node);
        returnArrow(node);
        return;
      }
      node.children?.forEach(walk);
    };
    walk(tree);
    if (items.size === 0) return;

    const insertNotes = (node: HastNode) => {
      if (isFootnoteList(node)) return;
      const children = node.children;
      if (!children) return;
      for (let i = 0; i < children.length; i++) {
        const sup = children[i];
        const ref = sup.tagName === 'sup' ? sup.children?.find((child) => child.tagName === 'a') : undefined;
        if (!ref || ref.properties?.dataFootnoteRef === undefined) {
          insertNotes(sup);
          continue;
        }
        const refId = String(ref.properties.id ?? '');
        const href = String(ref.properties.href ?? '');
        const item = items.get(decodeURIComponent(href.replace(/^#/, '')));
        if (!item || !refId) continue;

        const label = (ref.children ?? []).map((child) => child.value ?? '').join('');
        ref.children = [...(ref.children ?? []), ring('fn-ring', RING_PATH)];
        const note = el(
          'span',
          { className: ['fn-note'], id: refId.replace('fnref', 'fnnote'), role: 'note', hidden: true },
          [
            el('span', { className: ['fn-num'] }, [
              el('span', { className: ['fn-num-digit'] }, [{ type: 'text', value: label }]),
              ring('fn-num-ring', NOTE_RING_PATH),
            ]),
            { type: 'text', value: ' ' },
            ...noteContent(item),
          ]
        );
        children.splice(i + 1, 0, note);
        i++;
      }
    };
    insertNotes(tree);
  };
}

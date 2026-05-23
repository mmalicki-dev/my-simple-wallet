// Parses apps/frontend/public/icons.svg and generates
// apps/mobile/src/generated/iconData.ts for use with react-native-svg's SvgXml.
//
// Run: node scripts/generate-icons.mjs

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const SPRITE = resolve(root, "apps/frontend/public/icons.svg");
const OUTPUT = resolve(root, "apps/mobile/src/generated/iconData.ts");

// ─── parse ────────────────────────────────────────────────────────────────────

const svg = readFileSync(SPRITE, "utf8");

/** Extract a single named attribute value from an attribute string. */
function attr(attrs, name) {
  const m = new RegExp(`(?:^|\\s)${name}="([^"]*)"`, "i").exec(attrs);
  return m ? m[1] : null;
}

/** Remove all occurrences of a named attribute from an attribute string. */
function dropAttr(attrs, name) {
  return attrs.replace(new RegExp(`\\s*${name}="[^"]*"`, "gi"), "");
}

const icons = {};

// Match every <symbol ...>...</symbol> block (including multi-line content).
const symbolRe = /<symbol([^>]*)>([\s\S]*?)<\/symbol>/g;
let m;

while ((m = symbolRe.exec(svg)) !== null) {
  const [, rawAttrs, rawContent] = m;

  const id = attr(rawAttrs, "id");
  const viewBox = attr(rawAttrs, "viewBox");
  if (!id || !viewBox) continue;

  // Any attributes besides id/viewBox (stroke-width, fill, stroke, etc.)
  // are presentation attributes that apply to all child elements in the browser
  // via SVG inheritance. We replicate this by wrapping in a <g>.
  let extras = dropAttr(rawAttrs, "id");
  extras = dropAttr(extras, "viewBox").trim();

  const content = rawContent.trim();
  const inner = extras ? `<g ${extras}>${content}</g>` : content;

  // Build a self-contained SVG string ready for SvgXml.
  icons[id] = {
    viewBox,
    xml: `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`,
  };
}

// ─── emit ─────────────────────────────────────────────────────────────────────

mkdirSync(dirname(OUTPUT), { recursive: true });

const entries = Object.entries(icons);

let out = `\
// AUTO-GENERATED — do not edit manually.
// Source: apps/frontend/public/icons.svg
// Run:    node scripts/generate-icons.mjs

export interface IconEntry {
  viewBox: string;
  /** Complete <svg> string for SvgXml. Uses currentColor for the icon color. */
  xml: string;
}

export const iconData: Record<string, IconEntry> = {
`;

for (const [id, { viewBox, xml }] of entries) {
  // Escape template-literal special chars inside the xml string.
  const safe = xml.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
  out += `  "${id}": { viewBox: "${viewBox}", xml: \`${safe}\` },\n`;
}

out += `};\n`;

writeFileSync(OUTPUT, out, "utf8");
console.log(`✓ Generated ${entries.length} icons → ${OUTPUT}`);

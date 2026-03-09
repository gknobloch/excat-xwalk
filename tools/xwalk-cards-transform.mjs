/**
 * Transforms cards-teaser content cells from import format to xwalk-compatible format.
 *
 * Import format:  <h2><a href="url">title</a></h2> + optional description
 * Xwalk format:   <p>title</p><p><a href="url">title</a></p>
 *
 * The block JS recombines title + link into <h2><a href>title</a></h2> at decoration time.
 */
import { readFileSync, writeFileSync } from 'fs';

const file = process.argv[2] || 'content/index.plain.html';
const html = readFileSync(file, 'utf-8');
const lines = html.split('\n');
const output = [];
let inCardsTeaserContent = false;
let skipNextDescription = false;
let transformed = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Skip description lines after an h2 transformation
  if (skipNextDescription) {
    skipNextDescription = false;
    // Skip <p>...</p> lines that are card descriptions (not links)
    if (line.trim().startsWith('<p>') && !line.includes('<a href=') && line.trim().endsWith('</p>')) {
      continue;
    }
    if (line.trim().startsWith('<p><strong>') && line.trim().endsWith('</p>')) {
      continue;
    }
  }

  // Skip <p><strong>R+V</strong></p> style prefix lines before h2
  if (line.trim().match(/^<p><strong>[^<]+<\/strong><\/p>$/) && i + 1 < lines.length && lines[i + 1].trim().startsWith('<h2>')) {
    continue;
  }

  // Transform <h2><a href="url">title</a></h2> → <p>title</p>\n<p><a href="url">title</a></p>
  const h2Match = line.match(/^(\s*)<h2><a href="([^"]+)"[^>]*>(.+?)<\/a><\/h2>$/);
  if (h2Match) {
    const [, indent, href, title] = h2Match;
    output.push(`${indent}<p>${title}</p>`);
    output.push(`${indent}<p><a href="${href}">${title}</a></p>`);
    skipNextDescription = true;
    transformed++;
    continue;
  }

  output.push(line);
}

const result = output.join('\n');
writeFileSync(file, result, 'utf-8');
console.log(`Transformed ${transformed} cards in ${file}`);

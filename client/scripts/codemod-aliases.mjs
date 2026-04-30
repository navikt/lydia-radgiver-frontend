#!/usr/bin/env node
// Konverterer relative imports som klatrer to eller flere nivåer (../../...) til '@/'-alias.
// Behold ett-nivå relative ('./foo', '../foo') siden de er lokale og lesbare.

import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, "..", "src");

function* walk(dir) {
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const st = statSync(full);
        if (st.isDirectory()) yield* walk(full);
        else if (/\.(ts|tsx|js|jsx)$/.test(entry)) yield full;
    }
}

// Match både `import ... from '...'`, `import '...'`, og `} from '...'`.
const importRe = /(\bfrom\s+|\bimport\s+)(['"])((?:\.\.\/){2,}[^'"]+)(\2)/g;

let totalEdits = 0;
let filesChanged = 0;

for (const file of walk(srcDir)) {
    const original = readFileSync(file, "utf8");
    const fileDir = dirname(file);
    let edits = 0;
    const updated = original.replace(importRe, (m, kw, q, spec, qEnd) => {
        const absoluteTarget = resolve(fileDir, spec);
        const fromSrc = relative(srcDir, absoluteTarget).split(/[\\/]/).join("/");
        if (fromSrc.startsWith("..")) return m;
        edits++;
        return `${kw}${q}@/${fromSrc}${qEnd}`;
    });
    if (edits > 0) {
        writeFileSync(file, updated);
        totalEdits += edits;
        filesChanged++;
    }
}

console.log(`Konverterte ${totalEdits} import(er) i ${filesChanged} fil(er).`);

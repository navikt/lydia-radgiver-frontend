#!/usr/bin/env node
// Konverter relative imports i __tests__ til @/-alias slik at flytting til
// colocation ikke krever import-oppdateringer.

import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, relative, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const testsDir = resolve(root, "__tests__");
const srcDir = resolve(root, "src");

function* walk(dir) {
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const st = statSync(full);
        if (st.isDirectory()) yield* walk(full);
        else if (/\.(ts|tsx|js|jsx)$/.test(entry)) yield full;
    }
}

const importRe = /(\bfrom\s+|\bimport\s+)(['"])(\.\.?\/[^'"]+)(\2)/g;

let totalEdits = 0;
let filesChanged = 0;

for (const file of walk(testsDir)) {
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

console.log(`Konverterte ${totalEdits} import(er) i ${filesChanged} testfil(er).`);

#!/usr/bin/env node
// Migrer én feature i én operasjon. Tar en spec-fil med mappings,
// flytter filer, fikser relative imports i de flyttede filene,
// og oppdaterer imports andre steder i src/.
//
// Bruk: node scripts/migrate-features.mjs <spec.json>
//
// Spec-format:
// {
//   "feature": "leveranse",
//   "mappings": [
//     ["api/lydia-api/leveranse",       "api/leveranse"],
//     ["domenetyper/leveranse",         "types/leveranse"]
//   ]
// }

import {
    readdirSync, readFileSync, writeFileSync, statSync,
    mkdirSync, renameSync, existsSync,
} from "node:fs";
import { join, resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const srcDir = resolve(root, "src");

const specPath = process.argv[2];
if (!specPath) {
    console.error("Bruk: migrate-features.mjs <spec.json>");
    process.exit(1);
}
const spec = JSON.parse(readFileSync(specPath, "utf8"));
const { feature, mappings } = spec;

function* walk(dir) {
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const st = statSync(full);
        if (st.isDirectory()) yield* walk(full);
        else if (/\.(ts|tsx|js|jsx)$/.test(entry)) yield full;
    }
}

// 1. Flytt filer fysisk
const movedFiles = [];
for (const [fra, til] of mappings) {
    const from = resolve(srcDir, `${fra}.ts`);
    const fromTsx = resolve(srcDir, `${fra}.tsx`);
    const actualFrom = existsSync(from) ? from : fromTsx;
    if (!existsSync(actualFrom)) {
        console.error(`MANGLER kilde: ${fra}`);
        process.exit(1);
    }
    const ext = actualFrom.endsWith(".tsx") ? ".tsx" : ".ts";
    const to = resolve(srcDir, "features", feature, `${til}${ext}`);
    mkdirSync(dirname(to), { recursive: true });
    renameSync(actualFrom, to);
    movedFiles.push({ from: actualFrom, to });
    console.log(`MV ${relative(root, actualFrom)} → ${relative(root, to)}`);
}

// 2. Konverter relative imports inne i flyttede filer til @/-form
for (const { from, to } of movedFiles) {
    let s = readFileSync(to, "utf8");
    const fromDir = dirname(from);
    s = s.replace(/(from\s+|jest\.mock\(|jest\.requireActual\(|require\()(['"])(\.\.?\/[^'"]+)(['"])/g,
        (m, kw, q1, spec, q2) => {
            const abs = resolve(fromDir, spec);
            const fromSrc = relative(srcDir, abs).split("/").join("/");
            if (fromSrc.startsWith("..")) return m;
            return `${kw}${q1}@/${fromSrc}${q2}`;
        });
    writeFileSync(to, s);
}

// 3. Oppdater alle imports i src/ og __mocks__/ som peker på de gamle stiene.
// To strategier:
//   (a) String-replace for @/<fra> og (../)+(src/)?<fra> – fanger alias og dyp-relative.
//   (b) Path-resolve hver relativ import og sjekk om den peker til en flyttet fil –
//       fanger naboimporter som "./sok".
const targetByOldAbs = new Map();
for (const [fra, til] of mappings) {
    const oldAbs = resolve(srcDir, fra);
    targetByOldAbs.set(oldAbs, `@features/${feature}/${til}`);
}

const replacements = mappings.map(([fra, til]) => {
    const target = `@features/${feature}/${til}`;
    const escFra = fra.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return [
        new RegExp(`(["'])@/${escFra}(["'])`, "g"),
        new RegExp(`(["'])(?:\\.\\.?/)+(?:src/)?${escFra}(["'])`, "g"),
        target,
    ];
});

const importLikeRe = /(from\s+|jest\.mock\(\s*|jest\.requireActual\(\s*|require\(\s*)(["'])(\.\.?\/[^"']+)(["'])/g;

let touched = 0;
const scanDirs = [srcDir, resolve(root, "__mocks__")];
for (const sd of scanDirs) {
    if (!existsSync(sd)) continue;
    for (const file of walk(sd)) {
    let s = readFileSync(file, "utf8");
    const before = s;
    for (const [aliasRe, relRe, target] of replacements) {
        s = s.replace(aliasRe, `$1${target}$2`);
        s = s.replace(relRe, `$1${target}$2`);
    }
    s = s.replace(importLikeRe, (m, kw, q1, spec, q2) => {
        const abs = resolve(dirname(file), spec);
        const t = targetByOldAbs.get(abs);
        return t ? `${kw}${q1}${t}${q2}` : m;
    });
    if (s !== before) {
        writeFileSync(file, s);
        touched++;
    }
    }
}
console.log(`\nFerdig: feature=${feature}, ${movedFiles.length} fil(er) flyttet, ${touched} fil(er) oppdatert.`);

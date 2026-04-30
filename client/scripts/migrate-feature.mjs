#!/usr/bin/env node
// Codemod for å migrere filer inn i features/<navn>/{api,types}.
//
// Bruk:
//   node scripts/migrate-feature.mjs <feature> <fra> <til>
//
// Eksempel:
//   node scripts/migrate-feature.mjs bruker api/lydia-api/bruker api/bruker
//   node scripts/migrate-feature.mjs bruker domenetyper/brukerinformasjon types/brukerinformasjon
//
// Skriptet:
//   1. Oppdaterer alle imports som peker på `<fra>` (både via @/-alias og relative
//      stier) til `@features/<feature>/<til>`.
//   2. Flytter ikke filer fysisk – det gjøres med `mv` separat for tydelig diff.
//   3. Antar at `@features/*` er konfigurert som alias.

import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, "..", "src");

const [, , feature, fra, til] = process.argv;
if (!feature || !fra || !til) {
    console.error("Bruk: migrate-feature.mjs <feature> <fra> <til>");
    process.exit(1);
}

const target = `@features/${feature}/${til}`;

function* walk(dir) {
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        const st = statSync(full);
        if (st.isDirectory()) yield* walk(full);
        else if (/\.(ts|tsx|js|jsx)$/.test(entry)) yield full;
    }
}

const escFra = fra.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const aliasRe = new RegExp(`(["'])@/${escFra}(["'])`, "g");
const relRe = new RegExp(`(["'])(?:\\.\\.?/)+${escFra}(["'])`, "g");

let changed = 0;
for (const file of walk(srcDir)) {
    let s = readFileSync(file, "utf8");
    const before = s;
    s = s.replace(aliasRe, `$1${target}$2`);
    s = s.replace(relRe, `$1${target}$2`);
    if (s !== before) {
        writeFileSync(file, s);
        changed++;
    }
}
console.log(`Oppdaterte ${changed} fil(er): ${fra} → ${target}`);

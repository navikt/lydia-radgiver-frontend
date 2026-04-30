#!/usr/bin/env node
// Flytter testfiler fra __tests__/ til samme katalog som kilden de tester.
// Strategi: parse alle imports som peker inn i src/ via @/-alias.
// Velg den importen hvis basename matcher testfilens basename (uten .test).
// Hvis ingen treff: bruk speilingen (komponenttester/Pages/X → src/Pages/X).

import {
    readdirSync,
    readFileSync,
    writeFileSync,
    statSync,
    existsSync,
    mkdirSync,
    renameSync,
    rmdirSync,
} from "node:fs";
import { join, relative, resolve, dirname, basename } from "node:path";
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
        else if (/\.test\.(ts|tsx|js|jsx)$/.test(entry)) yield full;
    }
}

function resolveAlias(spec) {
    if (!spec.startsWith("@/")) return null;
    const target = resolve(srcDir, spec.slice(2));
    const candidates = [
        target,
        target + ".ts",
        target + ".tsx",
        target + ".js",
        target + ".jsx",
        join(target, "index.ts"),
        join(target, "index.tsx"),
    ];
    for (const c of candidates) {
        if (existsSync(c) && statSync(c).isFile()) return c;
    }
    return null;
}

const importRe = /\bfrom\s+(['"])(@\/[^'"]+)\1/g;

let moved = 0;
let skipped = 0;

for (const file of walk(testsDir)) {
    const content = readFileSync(file, "utf8");
    const testBase = basename(file).replace(/\.test\.(ts|tsx|js|jsx)$/, "");

    const imports = [];
    let m;
    while ((m = importRe.exec(content)) !== null) {
        const spec = m[2];
        const target = resolveAlias(spec);
        if (target) imports.push({ spec, target });
    }

    let targetDir = null;
    // 1. eksakt basename-match (av imports)
    for (const imp of imports) {
        const tBase = basename(imp.target).replace(/\.(ts|tsx|js|jsx)$/, "");
        if (tBase === testBase) {
            targetDir = dirname(imp.target);
            break;
        }
        if (tBase === "index" && basename(dirname(imp.target)) === testBase) {
            targetDir = dirname(imp.target);
            break;
        }
    }
    // 2. case-insensitiv basename-match
    if (!targetDir) {
        const lc = testBase.toLowerCase();
        for (const imp of imports) {
            const tBase = basename(imp.target).replace(/\.(ts|tsx|js|jsx)$/, "").toLowerCase();
            if (tBase === lc) {
                targetDir = dirname(imp.target);
                break;
            }
            if (tBase === "index" && basename(dirname(imp.target)).toLowerCase() === lc) {
                targetDir = dirname(imp.target);
                break;
            }
        }
    }
    // 3. fallback: speilingen for komponenttester/Pages/...
    if (!targetDir) {
        const rel = relative(testsDir, file);
        const parts = rel.split("/");
        if (parts[0] === "komponenttester" || parts[0] === "enhetstester") {
            const sub = parts.slice(1, -1);
            const candidate = resolve(srcDir, ...sub);
            if (sub.length > 0 && existsSync(candidate) && statSync(candidate).isDirectory()) {
                targetDir = candidate;
            }
        }
    }
    // 4. siste fallback: dir av første import
    if (!targetDir && imports.length > 0) {
        targetDir = dirname(imports[0].target);
    }

    if (!targetDir) {
        console.warn(`SKIPPED (ingen kilde): ${relative(root, file)}`);
        skipped++;
        continue;
    }

    const newPath = join(targetDir, basename(file));
    if (newPath === file) {
        skipped++;
        continue;
    }
    if (existsSync(newPath)) {
        console.warn(`SKIPPED (kollisjon): ${relative(root, file)} → ${relative(root, newPath)}`);
        skipped++;
        continue;
    }
    mkdirSync(targetDir, { recursive: true });
    renameSync(file, newPath);
    console.log(`${relative(root, file)} → ${relative(root, newPath)}`);
    moved++;
}

// Fjern tomme dirs
function pruneEmpty(dir) {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) pruneEmpty(full);
    }
    if (existsSync(dir) && readdirSync(dir).length === 0) {
        rmdirSync(dir);
    }
}
pruneEmpty(testsDir);

console.log(`\nFerdig: ${moved} flyttet, ${skipped} hoppet over.`);

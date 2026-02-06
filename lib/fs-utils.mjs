import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { spawn } from 'child_process';

export function replaceInFile(filePath, replacements) {
  let content = readFileSync(filePath, 'utf-8');
  for (const [placeholder, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
  }
  writeFileSync(filePath, content, 'utf-8');
}

export function copyDirectory(src, dest, replacements = {}) {
  if (statSync(src).isDirectory()) {
    if (!existsSync(dest)) {
      mkdirSync(dest, { recursive: true });
    }
    const entries = readdirSync(src);
    for (const entry of entries) {
      if (entry === 'node_modules' || entry === 'dist' || entry === '.turbo' || entry === '.git') {
        continue;
      }
      const srcPath = join(src, entry);
      const destEntry = entry === '_gitignore' ? '.gitignore' : entry;
      const destPath = join(dest, destEntry);
      copyDirectory(srcPath, destPath, replacements);
    }
  } else {
    const destDir = dirname(dest);
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }
    cpSync(src, dest);
    if (Object.keys(replacements).length > 0) {
      replaceInFile(dest, replacements);
    }
  }
}

export function processAllFiles(dir, replacements) {
  if (!existsSync(dir)) return;
  const entries = readdirSync(dir);
  for (const entry of entries) {
    if (entry === 'node_modules' || entry === '.git' || entry === '.turbo') {
      continue;
    }
    const entryPath = join(dir, entry);
    const stat = statSync(entryPath);
    if (stat.isDirectory()) {
      processAllFiles(entryPath, replacements);
    } else if (
      entry.endsWith('.json') ||
      entry.endsWith('.ts') ||
      entry.endsWith('.tsx') ||
      entry.endsWith('.js') ||
      entry.endsWith('.mjs') ||
      entry.endsWith('.yml') ||
      entry.endsWith('.yaml') ||
      entry.endsWith('.md') ||
      entry.endsWith('.example') ||
      entry.endsWith('.proto') ||
      entry.endsWith('.config.ts') ||
      entry.endsWith('.config.js') ||
      entry.endsWith('.sql')
    ) {
      replaceInFile(entryPath, replacements);
    }
  }
}

export function runCommand(command, args, cwd, silent = false) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      cwd,
      stdio: silent ? 'ignore' : 'inherit',
      shell: false,
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with code ${code}`));
      }
    });

    proc.on('error', (error) => {
      if (error.code === 'ENOENT') {
        reject(new Error(`Command not found: ${command}. Make sure it's installed and in your PATH.`));
      } else {
        reject(error);
      }
    });
  });
}

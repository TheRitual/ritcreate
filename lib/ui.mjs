import { createInterface } from 'readline';

export const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

export const icons = {
  rocket: '🚀',
  check: '✅',
  cross: '❌',
  warning: '⚠️',
  info: 'ℹ️',
  folder: '📁',
  gear: '⚙️',
  database: '🗄️',
  test: '🧪',
  docker: '🐳',
  git: '📦',
  lock: '🔒',
  file: '📄',
  trash: '🗑️',
  sparkles: '✨',
  hammer: '🔨',
  package: '📦',
};

let rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

export function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

export function closeRl() {
  rl.close();
}

export function log(message, color = colors.reset, icon = '') {
  console.log(`${color}${icon ? `${icon} ` : ''}${message}${colors.reset}`);
}

export function select(label, options, defaultIndex = 0) {
  if (!process.stdin.isTTY) return Promise.resolve(options[defaultIndex].value);

  return new Promise((resolvePromise) => {
    rl.close();

    let idx = defaultIndex;

    const render = (firstRender = false) => {
      if (!firstRender) {
        process.stdout.write(`\x1b[${options.length}A`);
      }
      for (let i = 0; i < options.length; i++) {
        const marker = i === idx ? `${colors.cyan}❯` : ' ';
        const text = i === idx
          ? `${colors.cyan}${options[i].label}`
          : `${colors.dim}${options[i].label}`;
        process.stdout.write(`\x1b[2K  ${marker} ${text}${colors.reset}\n`);
      }
    };

    process.stdout.write(`${label}\n`);
    render(true);

    process.stdin.setRawMode(true);
    process.stdin.resume();

    const onData = (key) => {
      if (key[0] === 27 && key[1] === 91) {
        if (key[2] === 65) idx = Math.max(0, idx - 1);
        if (key[2] === 66) idx = Math.min(options.length - 1, idx + 1);
        render();
      } else if (key[0] === 13) {
        process.stdout.write(`\x1b[${options.length + 1}A\r\x1b[J`);
        process.stdout.write(`${label} ${colors.cyan}${options[idx].label}${colors.reset}\n`);

        process.stdin.setRawMode(false);
        process.stdin.removeListener('data', onData);
        process.stdin.pause();
        rl = createInterface({ input: process.stdin, output: process.stdout });
        resolvePromise(options[idx].value);
      } else if (key[0] === 3) {
        process.stdout.write('\n');
        process.exit(0);
      }
    };

    process.stdin.on('data', onData);
  });
}

export function selectBool(label, defaultValue = true) {
  return select(label, [
    { label: 'Yes', value: true },
    { label: 'No', value: false },
  ], defaultValue ? 0 : 1);
}

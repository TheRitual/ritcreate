#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync, cpSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createInterface } from 'readline';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const colors = {
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

const icons = {
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

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

function log(message, color = colors.reset, icon = '') {
  console.log(`${color}${icon ? `${icon} ` : ''}${message}${colors.reset}`);
}

function toKebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '');
}

function toPascalCase(str) {
  return str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

function toSnakeCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, '');
}

function replaceInFile(filePath, replacements) {
  let content = readFileSync(filePath, 'utf-8');
  for (const [placeholder, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
  }
  writeFileSync(filePath, content, 'utf-8');
}

function copyDirectory(src, dest, replacements = {}) {
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
      const destPath = join(dest, entry);
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

function runCommand(command, args, cwd, silent = false) {
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

async function main() {
  const cliProjectName = process.argv[2];
  const cliProjectPath = process.argv[3];

  console.clear();
  log(`${icons.rocket} Nest + React + gRPC Project Generator`, colors.cyan, '');
  log('Create a new monorepo project with all the tools you need\n', colors.dim, '');

  const templateDir = join(__dirname, 'template');
  if (!existsSync(templateDir)) {
    log('Template directory not found. The template/ directory is required.', colors.red, icons.cross);
    process.exit(1);
  }

  let repoName;
  let fullProjectPath;
  if (cliProjectName !== undefined && cliProjectName.trim() !== '') {
    repoName = cliProjectName.trim();
    const defaultPath = cliProjectPath !== undefined && cliProjectPath.trim() !== ''
      ? resolve(cliProjectPath.trim())
      : resolve(toKebabCase(repoName));
    fullProjectPath = defaultPath;
  } else {
    repoName = await question(`${colors.cyan}${icons.folder} Repository name${colors.reset} (e.g., my-awesome-project): `);
    if (!repoName.trim()) {
      log('Repository name is required', colors.red, icons.cross);
      process.exit(1);
    }
    repoName = repoName.trim();
    const defaultPath = toKebabCase(repoName);
    const projectPathInput = await question(`${colors.cyan}${icons.folder} Project path${colors.reset} [./${defaultPath}]: `);
    const projectPath = projectPathInput.trim() || defaultPath;
    fullProjectPath = resolve(projectPath);
  }

  if (existsSync(fullProjectPath) && readdirSync(fullProjectPath).length > 0) {
    log(`Directory ${fullProjectPath} already exists and is not empty`, colors.red, icons.cross);
    process.exit(1);
  }

  const scope = await question(`${colors.cyan}${icons.package} Package scope${colors.reset} (e.g., @myorg): `);
  if (!scope.trim()) {
    log('Package scope is required', colors.red, icons.cross);
    process.exit(1);
  }

  log('\n', colors.reset, '');
  log('Configuration options:', colors.bright, icons.gear);

  const useDatabase = (await question(`  ${colors.yellow}${icons.database} Use database?${colors.reset} (y/n) [y]: `)) || 'y';
  const useStorybook = (await question(`  ${colors.yellow}${icons.test} Install Storybook?${colors.reset} (y/n) [y]: `)) || 'y';
  const usePlaywright = (await question(`  ${colors.yellow}${icons.test} Install Playwright?${colors.reset} (y/n) [y]: `)) || 'y';
  const useHusky = (await question(`  ${colors.yellow}${icons.lock} Setup Husky?${colors.reset} (y/n) [y]: `)) || 'y';
  const useGit = (await question(`  ${colors.yellow}${icons.git} Initialize Git?${colors.reset} (y/n) [y]: `)) || 'y';

  let gitRemote = '';
  if (useGit.toLowerCase() === 'y') {
    gitRemote = await question(`  ${colors.yellow}${icons.git} Git remote URL${colors.reset} (optional, press Enter to skip): `);
  }

  log('\n', colors.reset, '');
  log('Docker configuration:', colors.bright, icons.docker);

  const useDockerDB = useDatabase.toLowerCase() === 'y' 
    ? ((await question(`  ${colors.yellow}${icons.docker} Docker for database?${colors.reset} (y/n) [y]: `)) || 'y')
    : 'n';
  
  const useDockerProd = (await question(`  ${colors.yellow}${icons.docker} Production Docker images?${colors.reset} (y/n) [y]: `)) || 'y';

  log('\n', colors.reset, '');
  log('Testing setup:', colors.bright, icons.test);

  const testApi = (await question(`  ${colors.yellow}${icons.test} Tests for API?${colors.reset} (y/n) [y]: `)) || 'y';
  const testWeb = (await question(`  ${colors.yellow}${icons.test} Tests for Web?${colors.reset} (y/n) [y]: `)) || 'y';
  const testUI = (await question(`  ${colors.yellow}${icons.test} Tests for UI package?${colors.reset} (y/n) [n]: `)) || 'n';

  const config = {
    repoName: repoName.trim(),
    repoNameKebab: toKebabCase(repoName.trim()),
    repoNamePascal: toPascalCase(repoName.trim()),
    repoNameSnake: toSnakeCase(repoName.trim()),
    scope: scope.trim(),
    projectPath: fullProjectPath,
    useDatabase: useDatabase.toLowerCase() === 'y',
    useStorybook: useStorybook.toLowerCase() === 'y',
    usePlaywright: usePlaywright.toLowerCase() === 'y',
    useHusky: useHusky.toLowerCase() === 'y',
    useGit: useGit.toLowerCase() === 'y',
    gitRemote: gitRemote.trim(),
    useDockerDB: useDockerDB.toLowerCase() === 'y',
    useDockerProd: useDockerProd.toLowerCase() === 'y',
    testApi: testApi.toLowerCase() === 'y',
    testWeb: testWeb.toLowerCase() === 'y',
    testUI: testUI.toLowerCase() === 'y',
  };

  log('\n', colors.reset, '');
  log('Summary:', colors.bright, icons.info);
  log(`  Repository: ${config.repoNameKebab}`, colors.cyan, '');
  log(`  Path: ${config.projectPath}`, colors.cyan, '');
  log(`  Scope: ${config.scope}`, colors.cyan, '');
  log(`  Database: ${config.useDatabase ? 'Yes' : 'No'}`, config.useDatabase ? colors.green : colors.red, '');
  log(`  Storybook: ${config.useStorybook ? 'Yes' : 'No'}`, config.useStorybook ? colors.green : colors.red, '');
  log(`  Playwright: ${config.usePlaywright ? 'Yes' : 'No'}`, config.usePlaywright ? colors.green : colors.red, '');
  log(`  Husky: ${config.useHusky ? 'Yes' : 'No'}`, config.useHusky ? colors.green : colors.red, '');
  log(`  Git: ${config.useGit ? 'Yes' : 'No'}`, config.useGit ? colors.green : colors.red, '');
  log(`  Docker DB: ${config.useDockerDB ? 'Yes' : 'No'}`, config.useDockerDB ? colors.green : colors.red, '');
  log(`  Docker Prod: ${config.useDockerProd ? 'Yes' : 'No'}`, config.useDockerProd ? colors.green : colors.red, '');

  const confirm = await question(`\n${colors.yellow}${icons.warning} Proceed with project creation?${colors.reset} (y/n) [y]: `);
  if (confirm.toLowerCase() !== 'y' && confirm.trim() !== '') {
    log('Project creation cancelled', colors.yellow, icons.warning);
    process.exit(0);
  }

  log('\n', colors.reset, '');
  log('Creating project structure...', colors.cyan, icons.hammer);

  if (!existsSync(config.projectPath)) {
    mkdirSync(config.projectPath, { recursive: true });
  }

  const replacements = {
    '{{REPO_NAME}}': config.repoNameKebab,
    '{{REPO_NAME_PASCAL}}': config.repoNamePascal,
    '{{REPO_NAME_SNAKE}}': config.repoNameSnake,
    '{{SCOPE}}': config.scope,
    '{{SCOPE_API}}': `${config.scope}/api`,
    '{{SCOPE_WEB}}': `${config.scope}/web`,
  };

  copyDirectory(templateDir, config.projectPath, replacements);

  log('Template files copied', colors.green, icons.check);

  function processAllFiles(dir) {
    if (!existsSync(dir)) return;
    const entries = readdirSync(dir);
    for (const entry of entries) {
      if (entry === 'node_modules' || entry === '.git' || entry === '.turbo') {
        continue;
      }
      const entryPath = join(dir, entry);
      const stat = statSync(entryPath);
      if (stat.isDirectory()) {
        processAllFiles(entryPath);
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

  log('Processing template files...', colors.cyan, icons.gear);
  processAllFiles(config.projectPath);

  const gitignorePath = join(config.projectPath, '.gitignore');
  if (existsSync(gitignorePath)) {
    let gitignore = readFileSync(gitignorePath, 'utf-8');
    if (!gitignore.includes('deploy-api')) {
      gitignore += '\n# Deploy directories\ndeploy-api\ndeploy-web\n';
    }
    writeFileSync(gitignorePath, gitignore);
  }

  if (!config.useDatabase) {
    log('Removing database-related files...', colors.yellow, icons.trash);
    const dbFiles = [
      'apps/api/migrations',
      'apps/api/scripts/migrate.ts',
      'apps/api/scripts/seed.ts',
    ];
    for (const file of dbFiles) {
      const filePath = join(config.projectPath, file);
      if (existsSync(filePath)) {
        const fs = await import('fs/promises');
        await fs.rm(filePath, { recursive: true, force: true });
      }
    }

    const apiPackageJson = join(config.projectPath, 'apps/api/package.json');
    if (existsSync(apiPackageJson)) {
      const content = JSON.parse(readFileSync(apiPackageJson, 'utf-8'));
      if (content.dependencies?.pg) delete content.dependencies.pg;
      if (content.scripts?.['db:migrate']) delete content.scripts['db:migrate'];
      if (content.scripts?.['db:seed']) delete content.scripts['db:seed'];
      writeFileSync(apiPackageJson, JSON.stringify(content, null, 2) + '\n');
    }

    if (!config.useDockerDB) {
      const rootPackageJson = join(config.projectPath, 'package.json');
      if (existsSync(rootPackageJson)) {
        let content = readFileSync(rootPackageJson, 'utf-8');
        content = content.replace(/docker compose -f docker-compose.dev.yml up -d && /g, '');
        writeFileSync(rootPackageJson, content);
      }

      const dockerCompose = join(config.projectPath, 'docker-compose.dev.yml');
      if (existsSync(dockerCompose)) {
        const fs = await import('fs/promises');
        await fs.rm(dockerCompose, { force: true });
      }
    }

    const envExample = join(config.projectPath, 'env.example');
    if (existsSync(envExample)) {
      let content = readFileSync(envExample, 'utf-8');
      content = content.replace(/# App \(API\)\nDATABASE_URL=.*\n/, '');
      content = content.replace(/POSTGRES_USER=.*\n/g, '');
      content = content.replace(/POSTGRES_PASSWORD=.*\n/g, '');
      content = content.replace(/POSTGRES_DB=.*\n/g, '');
      writeFileSync(envExample, content);
    }

    const turboJson = join(config.projectPath, 'turbo.json');
    if (existsSync(turboJson)) {
      const content = JSON.parse(readFileSync(turboJson, 'utf-8'));
      if (content.tasks?.build?.env) {
        const envIndex = content.tasks.build.env.indexOf('DATABASE_URL');
        if (envIndex > -1) {
          content.tasks.build.env.splice(envIndex, 1);
        }
      }
      writeFileSync(turboJson, JSON.stringify(content, null, 2) + '\n');
    }
  }

  if (!config.useStorybook) {
    log('Removing Storybook-related files...', colors.yellow, icons.trash);
    const storybookFiles = ['packages/ui/.storybook'];
    for (const file of storybookFiles) {
      const filePath = join(config.projectPath, file);
      if (existsSync(filePath)) {
        const fs = await import('fs/promises');
        await fs.rm(filePath, { recursive: true, force: true });
      }
    }

    const uiPackageJson = join(config.projectPath, 'packages/ui/package.json');
    if (existsSync(uiPackageJson)) {
      const content = JSON.parse(readFileSync(uiPackageJson, 'utf-8'));
      if (content.scripts) {
        delete content.scripts.storybook;
        delete content.scripts['build-storybook'];
      }
      if (content.devDependencies) {
        delete content.devDependencies['@storybook/addon-essentials'];
        delete content.devDependencies['@storybook/react'];
        delete content.devDependencies['@storybook/react-vite'];
        delete content.devDependencies.storybook;
      }
      writeFileSync(uiPackageJson, JSON.stringify(content, null, 2) + '\n');
    }

    const turboJson = join(config.projectPath, 'turbo.json');
    if (existsSync(turboJson)) {
      const content = JSON.parse(readFileSync(turboJson, 'utf-8'));
      if (content.tasks) {
        delete content.tasks.storybook;
      }
      writeFileSync(turboJson, JSON.stringify(content, null, 2) + '\n');
    }

    const uiSrcDir = join(config.projectPath, 'packages/ui/src');
    if (existsSync(uiSrcDir)) {
      const files = readdirSync(uiSrcDir);
      for (const file of files) {
        if (file.endsWith('.stories.tsx')) {
          const fs = await import('fs/promises');
          await fs.rm(join(uiSrcDir, file), { force: true });
        }
      }
    }
  }

  if (!config.usePlaywright) {
    log('Removing Playwright-related files...', colors.yellow, icons.trash);
    const playwrightFiles = ['e2e', 'playwright.config.ts'];
    for (const file of playwrightFiles) {
      const filePath = join(config.projectPath, file);
      if (existsSync(filePath)) {
        const fs = await import('fs/promises');
        await fs.rm(filePath, { recursive: true, force: true });
      }
    }

    const rootPackageJson = join(config.projectPath, 'package.json');
    if (existsSync(rootPackageJson)) {
      const content = JSON.parse(readFileSync(rootPackageJson, 'utf-8'));
      if (content.scripts) {
        delete content.scripts['test:e2e'];
      }
      if (content.devDependencies) {
        delete content.devDependencies['@playwright/test'];
      }
      writeFileSync(rootPackageJson, JSON.stringify(content, null, 2) + '\n');
    }
  }

  if (!config.testApi) {
    const apiPackageJson = join(config.projectPath, 'apps/api/package.json');
    if (existsSync(apiPackageJson)) {
      const content = JSON.parse(readFileSync(apiPackageJson, 'utf-8'));
      if (content.devDependencies) {
        delete content.devDependencies.vitest;
      }
      if (content.scripts) {
        delete content.scripts.test;
      }
      writeFileSync(apiPackageJson, JSON.stringify(content, null, 2) + '\n');
    }
    const apiVitestConfig = join(config.projectPath, 'apps/api/vitest.config.ts');
    if (existsSync(apiVitestConfig)) {
      const fs = await import('fs/promises');
      await fs.rm(apiVitestConfig, { force: true });
    }
  }

  if (!config.testWeb) {
    const webPackageJson = join(config.projectPath, 'apps/web/package.json');
    if (existsSync(webPackageJson)) {
      const content = JSON.parse(readFileSync(webPackageJson, 'utf-8'));
      if (content.devDependencies) {
        delete content.devDependencies.vitest;
        delete content.devDependencies.jsdom;
      }
      if (content.scripts) {
        delete content.scripts.test;
      }
      writeFileSync(webPackageJson, JSON.stringify(content, null, 2) + '\n');
    }
    const webVitestConfig = join(config.projectPath, 'apps/web/vitest.config.ts');
    if (existsSync(webVitestConfig)) {
      const fs = await import('fs/promises');
      await fs.rm(webVitestConfig, { force: true });
    }
  }

  if (!config.testUI) {
    const uiPackageJson = join(config.projectPath, 'packages/ui/package.json');
    if (existsSync(uiPackageJson)) {
      const content = JSON.parse(readFileSync(uiPackageJson, 'utf-8'));
      if (content.scripts) {
        content.scripts.test = 'echo 0';
      }
      writeFileSync(uiPackageJson, JSON.stringify(content, null, 2) + '\n');
    }
  }

  if (!config.useDockerProd) {
    const dockerFiles = [
      'apps/api/Dockerfile',
      'apps/web/Dockerfile',
      'docker-compose.local-prod.yml',
    ];
    for (const file of dockerFiles) {
      const filePath = join(config.projectPath, file);
      if (existsSync(filePath)) {
        const fs = await import('fs/promises');
        await fs.rm(filePath, { force: true });
      }
    }
  }

  if (!config.useHusky) {
    const rootPackageJson = join(config.projectPath, 'package.json');
    if (existsSync(rootPackageJson)) {
      const content = JSON.parse(readFileSync(rootPackageJson, 'utf-8'));
      if (content.scripts?.prepare) {
        delete content.scripts.prepare;
      }
      if (content.devDependencies) {
        delete content.devDependencies.husky;
        delete content.devDependencies['lint-staged'];
      }
      if (content['lint-staged']) {
        delete content['lint-staged'];
      }
      writeFileSync(rootPackageJson, JSON.stringify(content, null, 2) + '\n');
    }
  }

  log('Creating .env files...', colors.cyan, icons.file);
  const envExamplePath = join(config.projectPath, 'env.example');
  if (existsSync(envExamplePath)) {
    const envContent = readFileSync(envExamplePath, 'utf-8');
    const envPath = join(config.projectPath, '.env');
    writeFileSync(envPath, envContent);
    log('.env file created', colors.green, icons.check);
  }

  if (config.useGit) {
    log('Initializing Git repository...', colors.cyan, icons.git);
    try {
      await runCommand('git', ['init'], config.projectPath, true);
      if (config.gitRemote) {
        await runCommand('git', ['remote', 'add', 'origin', config.gitRemote], config.projectPath, true);
        log(`Git remote added: ${config.gitRemote}`, colors.green, icons.check);
      }
      log('Git initialized', colors.green, icons.check);
    } catch (error) {
      log('Failed to initialize Git, you can do it manually later', colors.yellow, icons.warning);
    }
  }

  log('\n', colors.reset, '');
  log('Installing dependencies...', colors.cyan, icons.package);
  
  try {
    await runCommand('npm', ['install', '--no-audit', '--loglevel=error'], config.projectPath, false);
    log('Dependencies installed', colors.green, icons.check);
  } catch (error) {
    log('Failed to install dependencies, please run: npm install', colors.yellow, icons.warning);
  }

  if (config.useHusky) {
    log('Setting up Husky...', colors.cyan, icons.lock);
    try {
      await runCommand('npx', ['husky', 'init'], config.projectPath, true);
      
      const preCommitPath = join(config.projectPath, '.husky/pre-commit');
      const preCommitContent = `npx lint-staged
git add -u
npm run lint:fix
git add -u
npm run check-types
`;
      writeFileSync(preCommitPath, preCommitContent);
      log('Husky configured', colors.green, icons.check);
    } catch (error) {
      log('Failed to setup Husky, you can do it manually: npx husky init', colors.yellow, icons.warning);
    }
  }

  log('\n', colors.reset, '');
  log('Project created successfully!', colors.green, icons.sparkles);
  log('\n', colors.reset, '');
  log('Next steps:', colors.bright, icons.info);
  log(`  cd ${config.projectPath}`, colors.cyan, '');
  if (config.useDatabase) {
    log('  Review and update .env file with your database configuration', colors.cyan, '');
  }
  log('  npm run dev', colors.cyan, '');
  log('\n', colors.reset, '');
  log('Happy coding!', colors.green, icons.rocket);
  log('\n', colors.reset, '');

  rl.close();
}

main().catch((error) => {
  log(`Error: ${error.message}`, colors.red, icons.cross);
  console.error(error);
  process.exit(1);
});

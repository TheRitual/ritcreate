#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { colors, icons, log, question, select, closeRl } from './lib/ui.mjs';
import { toKebabCase, toPascalCase, toSnakeCase } from './lib/text.mjs';
import { copyDirectory, processAllFiles } from './lib/fs-utils.mjs';
import { getVersion, printHeader, printSummary, gatherConfig } from './lib/prompts.mjs';
import { applyConfig } from './lib/apply-config.mjs';
import { gatherEnvConfig, buildEnvFileContent, getDefaultEnv } from './lib/env-config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  const argv = process.argv.slice(2);
  const yesIndex = argv.findIndex((a) => a === '--yes' || a === '-y');
  const yesMode = yesIndex !== -1;
  if (yesMode) argv.splice(yesIndex, 1);
  const cliProjectName = argv[0];
  const cliProjectPath = argv[1];

  const version = getVersion(__dirname);
  console.clear();
  printHeader(version);

  const templateDir = join(__dirname, 'template');
  if (!existsSync(templateDir)) {
    log('Template directory not found. The template/ directory is required.', colors.red, icons.cross);
    process.exit(1);
  }

  let repoName;
  let fullProjectPath;
  if (yesMode) {
    repoName = cliProjectName?.trim() || 'ritcreate-dev';
    fullProjectPath = cliProjectPath?.trim()
      ? resolve(cliProjectPath.trim())
      : resolve(__dirname, '.ritcreate-dev');
  } else if (cliProjectName !== undefined && cliProjectName.trim() !== '') {
    repoName = cliProjectName.trim();
    const defaultPath = cliProjectPath !== undefined && cliProjectPath.trim() !== ''
      ? resolve(cliProjectPath.trim())
      : resolve(toKebabCase(repoName));
    fullProjectPath = defaultPath;
  } else {
    const defaultName = 'my-awesome-project';
    const repoNameInput = await question(`${colors.cyan}${icons.folder} Repository name${colors.reset} [${defaultName}]: `);
    repoName = repoNameInput.trim() || defaultName;
    const defaultPath = toKebabCase(repoName);
    const projectPathInput = await question(`${colors.cyan}${icons.folder} Project path${colors.reset} [./${defaultPath}]: `);
    const projectPath = projectPathInput.trim() || defaultPath;
    fullProjectPath = resolve(projectPath);
  }

  if (existsSync(fullProjectPath) && readdirSync(fullProjectPath).length > 0) {
    log(`Directory ${fullProjectPath} already exists and is not empty`, colors.red, icons.cross);
    process.exit(1);
  }

  let scope;
  if (yesMode) {
    scope = '@repo';
  } else {
    const scopeInput = await question(`${colors.cyan}${icons.package} Package scope${colors.reset} (e.g., @myorg) [@repo]: `);
    scope = scopeInput.trim() || '@repo';
  }

  let opts = {
    useDatabase: true,
    useStorybook: true,
    usePlaywright: true,
    useHusky: true,
    useGit: true,
    gitRemote: '',
    useDockerDB: true,
    useDockerProd: true,
    testApi: true,
    testWeb: true,
    testUI: true,
  };

  const repoNameKebab = toKebabCase(repoName.trim());
  const repoNameSnake = toSnakeCase(repoName.trim());
  let envConfig = null;

  if (!yesMode) {
    let confirmed = false;
    while (!confirmed) {
      console.clear();
      printHeader(version);
      log(`  Repository: ${repoNameKebab}`, colors.cyan, '');
      log(`  Path:       ${fullProjectPath}`, colors.cyan, '');
      log(`  Scope:      ${scope}`, colors.cyan, '');
      log('\n', colors.reset, '');

      opts = await gatherConfig(opts);

      log('\n', colors.reset, '');
      log('Environment configuration:', colors.bright, icons.file);
      log('', colors.reset, '');
      envConfig = await gatherEnvConfig(repoNameSnake, opts.useDatabase, envConfig);

      log('\n', colors.reset, '');
      printSummary(repoNameKebab, fullProjectPath, scope, opts);
      log('', colors.reset, '');

      const action = await select(`${colors.yellow}  What would you like to do?${colors.reset}`, [
        { label: `${icons.check} Create project`, value: 'create' },
        { label: `${icons.gear}  Edit configuration`, value: 'edit' },
        { label: `${icons.cross} Cancel`, value: 'cancel' },
      ]);

      if (action === 'create') {
        confirmed = true;
      } else if (action === 'cancel') {
        log('Project creation cancelled', colors.yellow, icons.warning);
        closeRl();
        process.exit(0);
      }
    }
  } else {
    envConfig = getDefaultEnv(repoNameSnake);
    log('\n', colors.reset, '');
    printSummary(repoNameKebab, fullProjectPath, scope, opts);
  }

  const config = {
    repoName: repoName.trim(),
    repoNameKebab,
    repoNamePascal: toPascalCase(repoName.trim()),
    repoNameSnake,
    scope: scope.trim(),
    projectPath: fullProjectPath,
    useDatabase: opts.useDatabase,
    useStorybook: opts.useStorybook,
    usePlaywright: opts.usePlaywright,
    useHusky: opts.useHusky,
    useGit: opts.useGit,
    gitRemote: opts.gitRemote,
    useDockerDB: opts.useDockerDB,
    useDockerProd: opts.useDockerProd,
    testApi: opts.testApi,
    testWeb: opts.testWeb,
    testUI: opts.testUI,
    envConfig,
  };

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

  log(' Processing template files...', colors.cyan, icons.gear);
  processAllFiles(config.projectPath, replacements);

  const gitignorePath = join(config.projectPath, '.gitignore');
  if (existsSync(gitignorePath)) {
    let gitignore = readFileSync(gitignorePath, 'utf-8');
    if (!gitignore.includes('deploy-api')) {
      gitignore += '\n# Deploy directories\ndeploy-api\ndeploy-web\n';
    }
    writeFileSync(gitignorePath, gitignore);
  }

  await applyConfig(config);

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

  closeRl();
}

main().catch((error) => {
  log(`Error: ${error.message}`, colors.red, icons.cross);
  console.error(error);
  process.exit(1);
});

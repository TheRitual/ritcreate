import { readFileSync } from 'fs';
import { join } from 'path';
import { colors, icons, log, selectBool, question } from './ui.mjs';

export function getVersion(baseDir) {
  try {
    return JSON.parse(readFileSync(join(baseDir, 'jsr.json'), 'utf-8')).version;
  } catch {
    try {
      return JSON.parse(readFileSync(join(baseDir, 'package.json'), 'utf-8')).version;
    } catch {
      return 'unknown';
    }
  }
}

export function printHeader(version) {
  log(`${icons.rocket} Nest + React + gRPC Project Generator ${colors.dim}v${version}`, colors.cyan, '');
  log('Create a new monorepo project with all the tools you need\n', colors.dim, '');
}

export function printSummary(repoNameKebab, fullProjectPath, scope, opts) {
  log('Summary:', colors.bright, icons.info);
  log(`  Repository:   ${repoNameKebab}`, colors.cyan, '');
  log(`  Path:         ${fullProjectPath}`, colors.cyan, '');
  log(`  Scope:        ${scope}`, colors.cyan, '');
  if (opts.useGit && opts.gitRemote) {
    log(`  Git remote:   ${opts.gitRemote}`, colors.cyan, '');
  }
  log('', colors.reset, '');
  const flags = [
    ['Database', opts.useDatabase],
    ['Storybook', opts.useStorybook],
    ['Playwright', opts.usePlaywright],
    ['Husky', opts.useHusky],
    ['Git', opts.useGit],
    ['Docker DB', opts.useDockerDB],
    ['Docker Prod', opts.useDockerProd],
    ['Tests API', opts.testApi],
    ['Tests Web', opts.testWeb],
    ['Tests UI', opts.testUI],
  ];
  for (const [label, value] of flags) {
    const padded = label.padEnd(13);
    log(`  ${padded} ${value ? 'Yes' : 'No'}`, value ? colors.green : colors.red, '');
  }
}

export async function gatherConfig(opts) {
  log('Configuration options:', colors.bright, icons.gear);
  log('', colors.reset, '');

  opts.useDatabase = await selectBool(`  ${icons.database}  Use database?`, opts.useDatabase);
  opts.useStorybook = await selectBool(`  ${icons.test} Install Storybook?`, opts.useStorybook);
  opts.usePlaywright = await selectBool(`  ${icons.test} Install Playwright?`, opts.usePlaywright);
  opts.useHusky = await selectBool(`  ${icons.lock} Setup Husky?`, opts.useHusky);
  opts.useGit = await selectBool(`  ${icons.git} Initialize Git?`, opts.useGit);

  if (opts.useGit) {
    const defaultRemote = opts.gitRemote || '';
    const hint = defaultRemote ? ` [${defaultRemote}]` : '';
    const gitRemoteInput = await question(
      `  ${colors.cyan}${icons.git} Git remote URL${colors.reset} (optional, Enter to skip)${hint}: `
    );
    opts.gitRemote = gitRemoteInput.trim() || defaultRemote;
  } else {
    opts.gitRemote = '';
  }

  log('\n', colors.reset, '');
  log('Docker configuration:', colors.bright, icons.docker);
  log('', colors.reset, '');

  if (opts.useDatabase) {
    opts.useDockerDB = await selectBool(`  ${icons.docker} Docker for database?`, opts.useDockerDB);
  } else {
    opts.useDockerDB = false;
  }
  opts.useDockerProd = await selectBool(`  ${icons.docker} Production Docker images?`, opts.useDockerProd);

  log('\n', colors.reset, '');
  log('Testing setup:', colors.bright, icons.test);
  log('', colors.reset, '');

  opts.testApi = await selectBool(`  ${icons.test} Tests for API?`, opts.testApi);
  opts.testWeb = await selectBool(`  ${icons.test} Tests for Web?`, opts.testWeb);
  opts.testUI = await selectBool(`  ${icons.test} Tests for UI package?`, opts.testUI);

  return opts;
}

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { colors, icons, log } from './ui.mjs';
import { runCommand } from './fs-utils.mjs';
import { buildEnvFileContent } from './env-config.mjs';

export async function applyConfig(config) {
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

      const devDockerFiles = [
        'docker-compose.dev.yml',
        'docker/envoy-grpc-web.dev.yml',
        'docker/prometheus.yml',
      ];
      const fs = await import('fs/promises');
      for (const file of devDockerFiles) {
        const filePath = join(config.projectPath, file);
        if (existsSync(filePath)) {
          await fs.rm(filePath, { force: true });
        }
      }

      const dockerDir = join(config.projectPath, 'docker');
      if (existsSync(dockerDir) && readdirSync(dockerDir).length === 0) {
        await fs.rm(dockerDir, { recursive: true, force: true });
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
      'docker-compose.prod.yml',
      'docker/envoy-grpc-web.prod.yml',
    ];
    const fs = await import('fs/promises');
    for (const file of dockerFiles) {
      const filePath = join(config.projectPath, file);
      if (existsSync(filePath)) {
        await fs.rm(filePath, { force: true });
      }
    }

    const dockerDir = join(config.projectPath, 'docker');
    if (existsSync(dockerDir) && readdirSync(dockerDir).length === 0) {
      await fs.rm(dockerDir, { recursive: true, force: true });
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

  log('Creating .env file...', colors.cyan, icons.file);
  if (config.envConfig) {
    const envContent = buildEnvFileContent(config.envConfig, config.useDatabase);
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
}

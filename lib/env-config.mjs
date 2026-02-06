import { colors, icons, log, question, selectBool } from './ui.mjs';
import { toSnakeCase } from './text.mjs';

function buildDefaultEnv(repoNameSnake, opts) {
  return {
    DATABASE_URL: `postgresql://postgres:postgres@localhost:5432/${repoNameSnake}`,
    PORT: '4000',
    ADMIN_EMAIL: 'admin@example.com',
    GRPC_HEALTH_PORT: '50051',
    GRPC_HELLO_PORT: '50052',
    VITE_API_URL: 'http://localhost:4000',
    POSTGRES_USER: 'postgres',
    POSTGRES_PASSWORD: 'postgres',
    POSTGRES_DB: repoNameSnake,
    ...opts,
  };
}

const ENV_LABELS = {
  DATABASE_URL: 'Database URL',
  PORT: 'API port',
  ADMIN_EMAIL: 'Admin email',
  GRPC_HEALTH_PORT: 'gRPC health port',
  GRPC_HELLO_PORT: 'gRPC hello port',
  VITE_API_URL: 'Web API URL',
  POSTGRES_USER: 'Postgres user',
  POSTGRES_PASSWORD: 'Postgres password',
  POSTGRES_DB: 'Postgres database',
};

export async function gatherEnvConfig(repoNameSnake, useDatabase, prevEnv) {
  const defaults = buildDefaultEnv(repoNameSnake, prevEnv);

  const useCustom = await selectBool(
    `  ${icons.file} Customize .env values? (No = use defaults)`,
    prevEnv?._useCustom ?? false
  );

  if (!useCustom) {
    return { ...defaults, _useCustom: false };
  }

  log('', colors.reset, '');
  log('  Enter values (press Enter to keep default):', colors.dim, '');

  const env = {};

  const apiKeys = ['PORT', 'ADMIN_EMAIL', 'GRPC_HEALTH_PORT', 'GRPC_HELLO_PORT'];
  if (useDatabase) {
    apiKeys.unshift('DATABASE_URL');
  }

  for (const key of apiKeys) {
    const val = await question(
      `  ${colors.cyan}${ENV_LABELS[key]}${colors.reset} [${defaults[key]}]: `
    );
    env[key] = val.trim() || defaults[key];
  }

  const webKeys = ['VITE_API_URL'];
  for (const key of webKeys) {
    const val = await question(
      `  ${colors.cyan}${ENV_LABELS[key]}${colors.reset} [${defaults[key]}]: `
    );
    env[key] = val.trim() || defaults[key];
  }

  if (useDatabase) {
    const dbKeys = ['POSTGRES_USER', 'POSTGRES_PASSWORD', 'POSTGRES_DB'];
    for (const key of dbKeys) {
      const val = await question(
        `  ${colors.cyan}${ENV_LABELS[key]}${colors.reset} [${defaults[key]}]: `
      );
      env[key] = val.trim() || defaults[key];
    }
  }

  return { ...defaults, ...env, _useCustom: true };
}

export function buildEnvFileContent(env, useDatabase) {
  let content = '';

  if (useDatabase) {
    content += `DATABASE_URL=${env.DATABASE_URL}\n`;
  }
  content += `PORT=${env.PORT}\n`;
  content += `ADMIN_EMAIL=${env.ADMIN_EMAIL}\n`;
  content += `GRPC_HEALTH_PORT=${env.GRPC_HEALTH_PORT}\n`;
  content += `GRPC_HELLO_PORT=${env.GRPC_HELLO_PORT}\n`;
  content += `\n`;
  content += `VITE_API_URL=${env.VITE_API_URL}\n`;

  if (useDatabase) {
    content += `\n`;
    content += `POSTGRES_USER=${env.POSTGRES_USER}\n`;
    content += `POSTGRES_PASSWORD=${env.POSTGRES_PASSWORD}\n`;
    content += `POSTGRES_DB=${env.POSTGRES_DB}\n`;
  }

  return content;
}

export function getDefaultEnv(repoNameSnake) {
  return buildDefaultEnv(repoNameSnake);
}

import { CleanedEnv, cleanEnv, num, port, str, ValidatorSpec } from 'envalid';
import { StringifyEnv } from '@novu/shared';

export function validateEnv() {
  return cleanEnv(process.env, envValidators);
}

export type ValidatedEnv = StringifyEnv<CleanedEnv<typeof envValidators>>;

export const envValidators = {
  TZ: str({ default: 'UTC' }),
  NODE_ENV: str({ choices: ['dev', 'test', 'production', 'ci', 'local'], default: 'local' }),
  PORT: port(),
  SENTRY_DSN: str({ default: undefined }),
  GRACEFUL_SHUTDOWN_TIMEOUT: num({ default: 5000 }),
} satisfies Record<string, ValidatorSpec<unknown>>;

import 'dotenv/config';

/**
 * Reads a required environment variable, failing fast at boot if it's
 * missing. Doing this once here is what lets the rest of the codebase
 * treat JWT_SECRET as a plain `string` instead of `string | undefined`.
 */
function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    process.exit(1);
  }

  return value;
}

export const JWT_SECRET = required('JWT_SECRET');
export const PORT = Number(process.env.PORT) || 5000;

/**
 * Comma-separated list of origins allowed to call this API. Leave unset
 * to allow any origin, which is the sensible default for local work.
 */
export const CORS_ORIGINS = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// ******** DATABASE *********
export const DATABASE_NAME = process.env.DATABASE_NAME || 'guild_manager';
export const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || 'toor';
export const DATABASE_USER = process.env.DATABASE_USER || 'root';

// ********* AUTHENTICATION *********
export const CLIENT_ID = process.env.CLIENT_ID || '619990232007180288';
export const CLIENT_SECRET = process.env.CLIENT_SECRET || '_CyaWXucWBbDkIzUeDmE--ke-_JgAsDy';
export const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:4200/api/auth/discord/login';

// ********* ENVIRONMENT *********
export const NODE_ENV = process.env.NODE_ENV || 'dev';
export const LOG_CONSOLE_LEVEL = process.env.LOG_CONSOLE_LEVEL || 'info';
export const TOKEN_COOKIE_NAME = process.env.TOKEN_COOKIE_NAME || 'authToken';

// ********* ADMINISTRATION *********
export const SUPER_ADMIN_DISCORD_ID = process.env.SUPER_ADMIN_DISCORD_ID || '139804254926798848';

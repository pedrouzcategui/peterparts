import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client.ts";

const ensureDatabaseUrl = (): void => {
  if (process.env.DATABASE_URL) {
    return;
  }

  const {
    PGHOST,
    PGDATABASE,
    PGUSER,
    PGPASSWORD,
    PGSSLMODE,
    PGCHANNELBINDING,
  } = process.env;

  if (!PGHOST || !PGDATABASE || !PGUSER || !PGPASSWORD) {
    return;
  }

  const params = new URLSearchParams();
  if (PGSSLMODE) {
    params.set("sslmode", PGSSLMODE);
  }
  if (PGCHANNELBINDING) {
    params.set("channel_binding", PGCHANNELBINDING);
  }

  const credentials = `${encodeURIComponent(PGUSER)}:${encodeURIComponent(PGPASSWORD)}`;
  const baseUrl = `postgresql://${credentials}@${PGHOST}/${PGDATABASE}`;
  const query = params.toString();

  process.env.DATABASE_URL = query ? `${baseUrl}?${query}` : baseUrl;
};

ensureDatabaseUrl();

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;

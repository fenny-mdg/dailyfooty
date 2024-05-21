import { MongoClient } from "mongodb";
import invariant from "tiny-invariant";

import { singleton } from "./singleton.server.ts";

// Hard-code a unique key, so we can look up the client when this module gets re-imported
const database = singleton("mongo", getDatabase);

async function getDatabase() {
  const { DATABASE_URL } = process.env;

  invariant(typeof DATABASE_URL === "string", "DATABASE_URL env var not set");

  const splittedDatabaseUrl = DATABASE_URL?.split("/");
  const databaseName = splittedDatabaseUrl?.pop();
  const databaseConnectionString = splittedDatabaseUrl?.join("/");
  const databaseUrl = new URL(databaseConnectionString);

  console.log(`🔌 setting up mongo client to ${databaseUrl.host}`);

  const client = new MongoClient(databaseConnectionString);
  let conn;
  try {
    conn = await client.connect();
  } catch (e) {
    console.error(e);
  }
  const db = conn?.db(databaseName);

  return db;
}

export default await database;

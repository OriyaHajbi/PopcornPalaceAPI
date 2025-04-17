/* eslint-disable prettier/prettier */
// lib/db.js
import { Client } from 'pg';

const client = new Client({
  host: 'localhost', // Docker container is on your local machine
  port: 5432, // Default Postgres port
  user: 'postgres', // Default Postgres user (check your Docker config)
  password: 'postgres', // Replace with your Postgres password
  database: 'popcorn_palace', // Replace with your database name
});

export const connectDb = async () => {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL');
  } catch (err) {
    console.error('Database connection error', err.stack);
  }
};

export const disconnectDb = async () => {
  await client.end();
};

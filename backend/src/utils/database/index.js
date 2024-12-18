require("dotenv").config();
const mysql = require("mysql2/promise");
const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
} = require("../../config/env");

class MySQLConnection {
  constructor() {
    this.config = {
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    };
    this.connection = null;
  }

  async connect() {
    try {
      if (!this.config) {
        throw new Error("Database configuration is required!");
      }

      this.connection = await mysql.createConnection(this.config);
      console.log("[info-DB]: connected to MySQL");
    } catch (error) {
      console.error("[info-DB]: error connecting to MySQL", error);
      throw error;
    }
  }

  async close() {
    if (this.connection) {
      try {
        await this.connection.end();
        console.log("[info-DB]: MySQL connection closed");
      } catch (error) {
        console.error("[info-DB]: error closing MySQL connection: ", error);
        throw error;
      }
    }
  }

  async query(sql, params) {
    if (!this.connection) {
      throw new Error("[info-DB]: Database doesn't connect properly");
    }
    try {
      const [rows] = await this.connection.execute(sql, params);
      console.log(
        `execute query : ${sql} and params : ${
          params ? JSON.stringify(params) : "no params"
        }`
      );

      return rows;
    } catch (error) {
      console.error("[info-DB]: error executing query: ", error);
      throw error;
    }
  }
}

module.exports = MySQLConnection;

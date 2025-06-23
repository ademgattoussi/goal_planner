const db = require("../config/db"); // MySQL connection or pool
const bcrypt = require("bcryptjs");

class User {
  // Create a new user
  static async create({ username, email, password, mobile }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.query(
      "INSERT INTO users (fullname, email, password, mobile) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, mobile]
    );

    return {
      id: result.insertId,
      username,
      email,
      mobile,
    };
  }

  // Find a user by email
  static async findByEmail(email) {
    const [rows] = await db.query(
      "SELECT userid, fullname AS username, email, password, mobile FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) return null;

    const user = rows[0];
    return {
      id: user.userid,
      username: user.username,
      email: user.email,
      password: user.password,
      mobile: user.mobile,
    };
  }

  // Find a user by ID
  static async findById(id) {
    const [rows] = await db.query(
      "SELECT userid, fullname AS username, email, password, mobile FROM users WHERE userid = ?",
      [id]
    );

    if (rows.length === 0) return null;

    const user = rows[0];
    return {
      id: user.userid,
      username: user.username,
      email: user.email,
      password: user.password,
      mobile: user.mobile,
    };
  }
}

module.exports = User;

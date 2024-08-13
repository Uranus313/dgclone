import bcrypt from "bcrypt"
export async function hashPassword(plainTextPassword) {
    const saltRounds = 10; // You can adjust this value as needed
    const hash = await bcrypt.hash(plainTextPassword, saltRounds);
    // Store the hash in your database
    return hash;
  }
export async function comparePassword(plainTextPassword, hashedPasswordFromDB) {
    const isMatch = await bcrypt.compare(plainTextPassword, hashedPasswordFromDB);
    // Check if the password matches
    return isMatch;
  }
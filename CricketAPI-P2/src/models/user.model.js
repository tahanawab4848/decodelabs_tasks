const bcrypt = require('bcrypt');

// In-memory array for users
const users = [];

// Seed initial users
const seedUsers = async () => {
  try {
    const password = await bcrypt.hash('Cricket123', 10);
    users.push(
      { id: 1, name: 'John Doe', email: 'john@example.com', password },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', password },
      { id: 3, name: 'Virat Singh', email: 'virat@cricket.com', password }
    );
    console.log('Seed users loaded.');
  } catch (err) {
    console.error('Error seeding users:', err);
  }
};

seedUsers();

module.exports = { users };

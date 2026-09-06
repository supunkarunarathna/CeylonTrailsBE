require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/db');

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✔ MySQL connection established.');
    app.listen(PORT, () => {
      console.log(`✔ Ceylon Trails API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('✘ Unable to connect to the database:', err.message);
    console.error('  Did you run "npm run db:init" and "npm run db:seed"? See README.md.');
    process.exit(1);
  }
}

start();

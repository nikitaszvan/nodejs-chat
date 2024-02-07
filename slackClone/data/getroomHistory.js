const { Client } = require('pg');
require('dotenv').config();
const logins = [
  {
      name: 'Emily Smith',
      email: 'emilysmith@outmail.com',
      avatar: './img/worker1_profile_pic.jpg',
      password: 'password',
  },
  {
      name: 'Joshua Johnson',
      email: 'joshuajohnson@outmail.com',
      avatar: './img/worker2_profile_pic.jpg',
      password: 'password',
  },
  {
      name: 'Sophia Davis',
      email: 'sophiadavis@outmail.com',
      avatar: './img/worker3_profile_pic.jpg',
      password: 'password',
  },
  {
      name: 'Michael Brown',
      email: 'michaelbrown@outmail.com',
      avatar: './img/worker4_profile_pic.jpg',
      password: 'password',
  },
  {
      name: 'George Blake',
      email: 'georgeblake@outmail.com',
      avatar: './img/worker5_profile_pic.jpg',
      password: 'password',
  },

];



const retrieveTableInfo = async (table) => {
  const db = new Client({
    user: process.env.PGADMIN_USER,
    host: "localhost",
    database: "postgres",
    password: process.env.PGADMIN_PASSWORD,
    port: 5432,
  });

  try {
    await db.connect();

    const { rows } = await db.query(`SELECT * FROM ${table}`);

    // Assuming logins is defined somewhere
    const addRows = rows.map(item => ({
      ...item,
      avatar: logins.find(user => user.name === item.user).avatar,
    }));

    return addRows;
  } catch (error) {
    console.error(`Error while retrieving data from ${table}:`, error);
    return [];
  } finally {
    await db.end(); // This closes the connection
  }
};

module.exports = retrieveTableInfo;


  
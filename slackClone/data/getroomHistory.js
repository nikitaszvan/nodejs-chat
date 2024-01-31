const pg = require("pg");
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

const db = new pg.Client({
  user: process.env.PGADMIN_USER,
  host: "localhost",
  database: "postgres",
  password: process.env.PGADMIN_PASSWORD,
  port: 5432,
});
db.connect();

const retrieveTableInfo = async (table) => {
  try {
      const { rows } = await db.query(`SELECT * FROM ${table}`);

      const addRows = rows.map(item => {
        return {
          ...item,
          avatar: logins.find(user => user.name === item.user).avatar,
        };
      });

      module.exports = addRows;
      return addRows;
    }
   catch (error) {
    console.error(`Error while retrieving data from ${tableName}:`, error);
    return [];
  }
};


  module.exports = retrieveTableInfo;

  
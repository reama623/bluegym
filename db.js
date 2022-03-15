import mysql from "mysql2";

// create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "bluegymadmin",
  password: "1352759",
  database: "bluegym",
  
});

export const request = async (q, params) => {
  return new Promise((resolve, reject) => {
    connection.query(q, params, function (err, results) {
      if (err) {
        return reject(err);
      }
      return resolve(results);
    });
  });
};

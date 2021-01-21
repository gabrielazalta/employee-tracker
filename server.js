var mysql = require("mysql");
const cTable = require('console.table');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Lucy0927!",
  database: "employee_db"
});

function mainMenu(){
    //ask inquirer question.. getall em

    //=>ans ... based on results call that spec fx
}

function readProducts() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM department", function(err, res) {
      if (err) throw err;
      // Log all results of the SELECT statement
      console.table(res);
      connection.end();
    });
  }

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
readProducts();
});

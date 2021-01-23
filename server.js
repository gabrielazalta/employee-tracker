var mysql = require("mysql");
const cTable = require('console.table');
var inquirer = require('inquirer');
const {
    allowedNodeEnvironmentFlags
} = require("process");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Lucy0927!",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    mainMenu();
});

function mainMenu() {
    inquirer.prompt({
        name: 'mainMenu',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'view all departments',
            'view all roles',
            'view all employees',
            'add a department',
            'add a role',
            'add an employee',
            'update an employee role',
            'all done!'
        ]
    }).then((answer) => {
        switch (answer.mainMenu) {
            case 'view all departments':
                readDepartments();
                break;
            case 'view all roles':
                readRoles();
                break;
            case 'view all employees':
                readEmployees();
                break;
            case 'add a department':
                addDepartment();
                break;
            case 'add a role':
                addRole();
                break;
            case 'add an employee':
                addEmployee();
                break;
            case 'update an employee role':
                updateRole();
                break;
            case 'all done!':
                closeApp();
                break;
        }
    })
}

//read from tables

//show departments
function readDepartments() {
    console.log("Showing all departments:");
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        connection.end();
        mainMenu();
    });
}

//show roles
function readRoles() {
    console.log("Showing all roles:");
    connection.query("SELECT * FROM roles", function (err, res) {
        if (err) throw err;
        console.table(res);
        connection.end();
        mainMenu();
    });
}

//show employees
function readEmployees() {
    console.log("Showing all employees:");
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        connection.end();
        mainMenu();
    });
}


//add to table

//add new dept
function addDepartment() {
    inquirer.prompt([{
        name: 'newDept',
        type: 'input',
        message: "What is the department's name?"
    }]).then((answer) => {
        var query = connection.query(
            "INSERT INTO department(name)", {
                name: answer.newDept
            },
            function (err, res) {
                if (err) throw err;
                console.log(answer.newDept + ' succesfully added!');
            }
        );
    })
    console.log(query.sql);
    mainMenu();
}

//add new role
function addRole() {
    inquirer.prompt([
        {
        name: 'newRole',
        type: 'input',
        message: "What is the name of this role?"
        },
        {
        name: 'newSalary',
        type: 'input',
        message: "What is the salary for this role?"
        },
        {
        name: 'newDeptId',
        type: 'list',
        message: "What departement does this role belong to?",
        choices: [//display current roles]
        }

]).then((answer) => {
        var query = connection.query(
            "INSERT INTO role(title, salary, department_id)", {
                title: answer.newRole,
                salary: answer.newSalary,
                department_id: answer.newDeptId
            },
            function (err, res) {
                if (err) throw err;
                console.log(answer.newRole + ' succesfully added!');
            }
        );
    })
    console.log(query.sql);
    mainMenu();
}


//add new role
function addEmployee() {
    inquirer.prompt([
        {
        name: 'employeeName',
        type: 'input',
        message: "What is this employees first name?"
        },
        {
        name: 'employeeLastName',
        type: 'input',
        message: "What is this employees last name?"
        },
        {
        name: 'RoleId',
        type: 'input',
        message: "What is this employees role ID?"
        },
        {
        name: 'employeeManager',
        type: 'list',
        message: "Who is this employee's manager?"
        Choices://display managers
        }

]).then((answer) => {
        var query = connection.query(
            "INSERT INTO employee(first_name, last_name, role_id, manager_id)", {
                first_name: answer.employeeName,
                last_name: answer.employeeLastName,
                role_id: answer.RoleId
                manager_id://connect to manager id
            },
            function (err, res) {
                if (err) throw err;
                console.log(answer.employeeName + answer.employeeLastName + ' succesfully added!');
            }
        );
    })
    console.log(query.sql);
    mainMenu();
}

//update employee role
function updateEmployeeRole() {
    inquirer.prompt([
        {
        name: 'chooseRole',
        type: 'list',
        message: "What employee would you like to update?",
        choices: [//display current employees]
        },
        {
        name: 'newRole',
        type: 'input',
        message: "What role would you like to assign to this employee?",
        choices: [//display current roles]
        }

])
    var query = connection.query(
      "UPDATE role SET ? WHERE ?",
      [
        {
          role_id: answer.newRole
        }
      ],
      function(err, res) {
        if (err) throw err;
        console.log("This employee's role has been updated to " + answer.newRole);
      }
    );
    console.log(query.sql);
    mainMenu();
  }

  //update employee manager
function updateEmployeeManager() {
    inquirer.prompt([
        {
        name: 'chooseManager',
        type: 'list',
        message: "What employee would you like to update?",
        choices: [//display current employees]
        },
        {
        name: 'newManager',
        type: 'input',
        message: "What manager would you like to assign to this employee?",
        choices: [//display current managers]
        }

])
    var query = connection.query(
      "UPDATE role SET ? WHERE ?",
      [
        {
          manager_id: answer.newManager
        }
      ],
      function(err, res) {
        if (err) throw err;
        console.log("This employee's role has been updated to " + answer.newManager);
      }
    );
    console.log(query.sql);
    mainMenu();
  }
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
            'update an employee manager',
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
                updateEmployeeRole();
                break;
            case 'update an employee manager':
                updateEmployeeManager();
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
    connection.query("SELECT * FROM role", function (err, res) {
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
        name: 'newDepartment',
        type: 'input',
        message: "What is the new department's name?"
    }]).then(function (answer) {
        var query = connection.query(
            "INSERT INTO department SET ?", {
                name: answer.newDepartment
            },

            function (err, res) {
                if (err) throw err;
                console.log(answer.newDepartment + ' succesfully added!');
                console.table(answer);
                mainMenu();
            }
        );
    })
}

//add new role
function addRole() {
    connection.query(`SELECT role.title AS newRole, role.salary AS newSalary, role.department_id AS newDeptId FROM role`, function (err, results) {
        if (err) throw err;

        inquirer.prompt([{
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
                choices: function () {
                    let choiceList = results[1].map(choice => choice.name);
                    return choiceList;
                },
            }
        ]).then(function (answer) {
            connection.query(
                `INSERT INTO role(title, salary, department_id) 
                 VALUES 
                 ("${answer.newRole}", "${answer.newSalary}", 
                 (SELECT department_id FROM department WHERE name = "${answer.newDeptId}"));`
            )
            console.log(answer.newRole + ' succesfully added!');
            console.table(results);
            mainMenu();
        });
    });
};


//add new role
function addEmployee() {
    const newEmployee = `SELECT * FROM employee`
    connection.query(newEmployee, (err, results) => {
        if (err) throw err;

        console.log('');
        console.table(chalk.yellow('List of current Roles:'), results[0]);

        inquirer.prompt([{
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
                message: "Who is this employee's manager?",
                choices: function () {
                    let choiceArray = results[1].map(choice => choice.first_name + choice.last_name);
                    return choiceArray;
                },
            }

        ]).then((answer) => {
            var query = connection.query(
                "INSERT INTO employee(first_name, last_name, role_id, manager_id)", {
                    first_name: answer.employeeName,
                    last_name: answer.employeeLastName,
                    role_id: answer.RoleId,
                    manager_id: answer.updateEmployeeManager
                },
                function (err, res) {
                    if (err) throw err;
                    console.log(answer.employeeName + answer.employeeLastName + ' succesfully added!');
                }
            );
        })
        console.log(query.sql);
        mainMenu();
    })
}


//update employee role
function updateEmployeeRole() {
    const updateRole = `SELECT * FROM employee; SELECT * FROM role`
    connection.query(updateRole, (err, results) => {
        if (err) throw err;

        inquirer.prompt([{
                name: 'chooseRole',
                type: 'list',
                message: "What employee would you like to update?",
                choices: function () {
                    let choiceArray = results[1].map(choice => choice.first_name + choice.last_name);
                    return choiceArray;
                },
            },
            {
                name: 'newRole',
                type: 'input',
                message: "What role would you like to assign to this employee?",
                choices: function () {
                    let choiceArray = results[1].map(choice => choice.title);
                    return choiceArray;
                },
            },

        ]).then((answer) => {
            var query = connection.query(
                "UPDATE role SET ? WHERE ?",
                [{
                    role_id: answer.newRole
                }],
                function (err, res) {
                    if (err) throw err;
                    console.log("This employee's role has been updated to " + answer.newRole);
                }
            );
        })
        console.log(query.sql);
        mainMenu();
    })
}
//update employee manager
function updateEmployeeManager() {
    const updateManager = `SELECT * FROM employee`
    connection.query(updateManager, (err, results) => {
        if (err) throw err;

        inquirer.prompt([{
                name: 'chooseEmployee',
                type: 'list',
                message: "What employee would you like to update?",
                choices: function () {
                    let choiceArray = results[1].map(choice => choice.first_name + choice.last_name);
                    return choiceArray;
                },
            },
            {
                name: 'newManager',
                type: 'input',
                message: "What manager would you like to assign to this employee?",
                choices: function () {
                    let choiceArray = results[1].map(choice => choice.first_name + choice.last_name);
                    return choiceArray;
                },
            }

        ]).then((answer) => {
            var query = connection.query(
                "UPDATE employee SET ? WHERE ?",
                [{
                        manager_id: answer.newManager,
                    },
                    {
                        first_name: answer.chooseEmployee
                    }
                ],
                function (err, res) {
                    if (err) throw err;
                    console.log("This employee's manager has been updated to " + answer.newManager);
                }
            );
        })
        console.log(query.sql);
        mainMenu();
    })
}
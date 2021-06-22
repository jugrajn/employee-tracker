// ------------ MY DEPENDENCES ------------
const inquirer = require('inquirer');
const mysql = require('mysql');


const connection = mysql.createConnection({
  host: 'localhost',
  // Your port, if not 3306
  port: 3306,
  // Your username
  user: 'root',
  // Be sure to update with your own MySQL password!
  password: '',
  database: 'employeesdb',
});


// ------------ IF SERVER CONNECTS AND THERES AN ERROR STOP ELSE RUN APPLICATION------------
connection.connect((err) => {
  if (err) throw err;
  start();
})


// ------------ START THE APPLICATION ------------
const start = () => {

  inquirer.prompt(
    {
      type: 'list',
      name: 'options',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'View All Employees by Department',
        'View All Employees by Manager',
        'View All Departments',
        'View All Roles',
        'Update Employee Role',
        'Add Employee',
        'Remove Employee',
        'Add Department',
        'Add role',
        'Exit'
        ],
  })
//------------ ADD SWITCH FUNCTION THAT INITATES ALL FUNCTIONS BASED ON RESPONSE ------------
  .then((response) => {

  })
}

// ------------ CREATE 'VIEW EMPLOYEES' FUNCTION ------------
const viewEmployees = () => {

};


// ------------ CREATE 'VIEW EMPLOYEES BY DEPARTMENT' FUNCTION ------------
const viewEmployeesByDepartment = () => {

};


// ------------ CREATE 'VIEW EMPLOYEES BY MANAGER' FUNCTION ------------
const viewEmployeesbyManager = () => {

};


// ------------ CREATE 'VIEW DEPARTMENTS' FUNCTION ------------
const viewDepartments = () => {

};


// ------------ CREATE 'VIEW ROLES' FUNCTION ------------
const viewRoles = () => {

}


// ------------ CREATE 'UPDATE EMPLOYEE ROLE' FUNCTION ------------
const updateEmployeeRole = () => {

};


// ------------ CREATE 'ADD EMPLOYEE' FUNCTION ------------
const addEmployee = () => {

};


// ------------ CREATE 'REMOVE EMPLOYEE' FUNCTION ------------
const removeEmployee = () => {

};


// ------------ CREATE 'ADD DEPARTEMENT' FUNCTION ------------
const addDepartment = () => {

};


// ------------ CREATE 'ADD ROLE' FUNCTION ------------
const addRole = () => {

};
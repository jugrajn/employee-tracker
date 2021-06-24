// ------------ MY DEPENDENCES ------------
const inquirer = require('inquirer');
const mysql = require('mysql')
              require('dotenv').config();

const cTable = require('console.table');


const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,

  user: process.env.DB_NAM,
  password: process.env.DB_USER,
  database: process.env.DB_PASSWORD,

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
    switch (response.choices) {
      case 'View All Employees':
        viewEmployees()
        break;
      case 'View All Employees by Department':
        viewEmployeesByDepartment()
        break;
      case 'View All Empployees by Manager':
        viewEmployeesbyManager()
        break;
      case 'View All Departments':
        viewDepartments()
        break;
      case 'View All Roles':
        viewRoles()
        break;
      case 'Update Employee Role':
        updateEmployeeRole()
        break;
      case 'Add Employee':
        addEmployee()
        break;
      case 'Remove Employee':
        removeEmployee()
        break;
      case 'Add Department':
        addDepartment()
        break;
      case 'Add role':
        addRole()
        break;
      case 'Exit':
        break
    }
  })
}



// ------------ CREATE 'VIEW EMPLOYEES' FUNCTION ------------
const viewEmployees = () => {
  connection.query("select * from employee"), (err, res) => {
    if (err) throw err;
    console.table(res)
    start();
  }
};


// ------------ CREATE 'VIEW EMPLOYEES BY DEPARTMENT' FUNCTION ------------
const viewEmployeesByDepartment = () => {

//  GET DEPT TABLE FIRST
  connection.query('SELECT * FROM employeesdb.department', (err, queryResponse) => {
    if (err) throw err;

// ASK USER THEN TO SELECT FROM LIST OF DEPTS
//MAP THE OBJECT FROM QUERY RESPONSE TO AVOID HARD CODING AND WILL INCLUDE ANY ADDED DEPTS FROM USER ------> SEE COMMENT '$$$'
    inquirer.prompt(
      {
        type: 'list',
        message: 'View employees by which department?',
        name: 'departmentid',
        choices: queryResponse.map(department => ({ value: department.id, name: department.name })) // $$$
      }
    )
    
    .then((deptChoice) => {
      connection.query(`SELECT employee.id as 'ID', employee.first_name as 'First Name', employee.last_name as 'Last Name', department.name as 'Department' FROM employee LEFT JOIN employeesdb.role on employee.role_id = role.id LEFT JOIN employeesdb.department ON department.id = role.department_id WHERE department.name = ?`, [deptChoice.departmentid], (err, chosenDeptData) => {
        if (err) throw err;
        console.table(chosenDeptData);
      })
    })
    // RESTART APPLICATION WITH INTITIAL PROMPTS
    start();
  });

};


// ------------ CREATE 'VIEW EMPLOYEES BY MANAGER' FUNCTION ------------
const viewEmployeesbyManager = () => {
  connection.query(''), (err, res) => {
    if (err) throw err;
    start();
  }

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
  inquirer.prompt([
    {
      type: 'input',
      message: "What is the employee's first name?",
      name: "firstName",
    },
    {
      type: 'input',
      message: "What is the employee's last name?",
      name: 'lastName',
    },
    {
      type: 'input',
      message: "What is the employee's role?",
      name: 'role',
    },
    {
      type: 'input',
      message: "Who is the employee's manager?",
      name: 'manager',
    }
  ])

  // WORK IN PROGRESSS
  .then((response) => {
    connection.query('insert into employee set ?') 
  })
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


// THIS BELOW IS THE RESPONSE FROM connection.query = `SELECT * FROM employeesdb.department`
[
  {
    id: 1,
    name: 'Board',
  },
  {
    id: 2,
    name: 'Engineering',
  },
  {
    id: 3,
    name: 'Security',
  }
]

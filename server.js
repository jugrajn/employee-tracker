// ------------ MY DEPENDENCES ------------
const inquirer = require('inquirer');
const mysql = require('mysql2')
require('dotenv').config();

require('console.table');
const util = require('util');


const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,

  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

});


// ------------ IF SERVER CONNECTS AND THERES AN ERROR STOP ELSE RUN APPLICATION------------
connection.connect((err) => {
  if (err) throw err;
  start();
})

//SETTING UP connection.query TO USE PROMISES INSTEAD OF CALLBACKS
connection.query = util.promisify(connection.query);

// ------------ START THE APPLICATION ------------
const start = async () => {

  const selectTask = await inquirer.prompt(
    {
      type: 'list',
      name: 'options',
      message: 'What would you like to do?',
      choices: 
      [
        'View All Employees',
        'View All Employees by Department',
        'View All Employees by Role',
        'View All Departments',
        'View All Roles',
        'Update Employee Role',
        'Add Employee',
        'Add Department',
        'Add Role',
        'Exit',
      ],
  })
  
//------------ ADD SWITCH FUNCTION THAT INITATES ALL FUNCTIONS BASED ON RESPONSE ------------
    switch (selectTask.options) {
      case 'View All Employees': // WORKING!!!!!!!!!!!!!!
        await viewEmployees();
        break;
      case 'View All Employees by Department':
        await viewEmployeesByDepartment()
        break;
      case 'View All Employees by Role':
        await viewEmployeesbyRole()
        break;
      case 'View All Departments': // WORKING!!!!!!!!!!!!!
        await viewDepartments()
        break;
      case 'View All Roles': // WORKING !!!!!!!!!!!!!!!
        await viewRoles()
        break;
      case 'Update Employee Role':
        await updateEmployeeRole()
        break;
      case 'Add Employee':
        await addEmployee()
        break;
      case 'Add Department':
        await addDepartment()
        break;
      case 'Add Role':
        await addRole()
        break;
      case 'Exit':
        break;
    }
  
}



// ------------ CREATE 'VIEW EMPLOYEES' FUNCTION ------------
const viewEmployees = async  () => {
  const response= await connection.query("SELECT * FROM employee")
     console.table(response);
     start(); 
};


// ------------ CREATE 'VIEW EMPLOYEES BY DEPARTMENT' FUNCTION ------------
const viewEmployeesByDepartment = async () => {

//  GET DEPT TABLE FIRST
  connection.query('SELECT * FROM employeesdb.department', async (err, queryResponse) => {
    if (err) throw err;

// ASK USER THEN TO SELECT FROM LIST OF DEPTS
//MAP THE OBJECT FROM QUERY RESPONSE TO AVOID HARD CODING AND WILL INCLUDE ANY ADDED DEPTS FROM USER ------> SEE COMMENT '$$$'
    const deptChoice = await inquirer.prompt(
      {
        type: 'list',
        message: 'View employees by which department?',
        name: 'departmentid',
        choices: queryResponse.map(department => ({ value: department.id, name: department.name })) // $$$
      })
      
      connection.query(`SELECT employee.id as 'ID', employee.first_name as 'First Name', employee.last_name as 'Last Name', department.name as 'Department' FROM employee LEFT JOIN employeesdb.role on employee.role_id = role.id LEFT JOIN employeesdb.department ON department.id = role.department_id WHERE department.name = ?`, [deptChoice.departmentid], (err, chosenDeptData) => {
        if (err) throw err;
        console.table(chosenDeptData);
      })
  
    // RESTART APPLICATION WITH INTITIAL PROMPTS
    
  });
  start();
};


// ------------ CREATE 'VIEW EMPLOYEES BY ROLE' FUNCTION ------------
const viewEmployeesbyRole = async () => {

  const queryResponse = await connection.query('SELECT * FROM employeesdb.role')
    
  const roleChoice = await inquirer.prompt(
      {
        type: 'list',
        message: 'View employees by which role?',
        name: 'roleid',
        choices: queryResponse.map(role => ({ value: role.id, name: role.title }))
  })

  const chosenRoleData = await connection.query(`SELECT employee.id as 'ID', employee.first_name as 'First Name', employee.last_name as 'Last Name', role.title as 'Title', role.salary as 'Salary' FROM employee LEFT JOIN employeesdb.role ON employee.role_id = role.id WHERE role.title = ?`, [roleChoice.roleid])
          console.table(chosenRoleData);
  
  start();
}


// ------------ CREATE 'VIEW DEPARTMENTS' FUNCTION ------------
const viewDepartments = async () => {

  const res = await connection.query('SELECT * FROM employeesdb.department')
    console.table(res);
  start();
};


// ------------ CREATE 'VIEW ROLES' FUNCTION ------------
const viewRoles = async () => {

  const res = await connection.query('SELECT * FROM employeesdb.role')
    console.table(res);
  start();
}


// ------------ CREATE 'UPDATE EMPLOYEE ROLE' FUNCTION ------------
const updateEmployeeRole = () => {
  connection.query(`SELECT * FROM employee`, (err, employeeTable) => {
    if (err) throw err;

    inquirer.prompt(
      {
        type: 'list',
        message: 'Which employees role is getting changed?',
        name: 'employeeid',
        choices: employeeTable.map(employee => ({name: employee.first_name + " " + employee.last_name, value: employee.id }))
      }
    )

    .then((chosenEmployee) => {

      connection.query(`SELECT * FROM role`, (err, roleTable) => {
        if (err) throw err;

        inquirer.prompt(
          {
            type:'list',
            message: 'What is the title of the new role?',
            name: 'roleid',
            choices: roleTable.map(role => ({ name: role.title, value: role.id}))
          }
        )

        .then((updatedRole) => {
          connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [updatedRole.role_id, chosenEmployee.id], (err, employeesNewRole) => {
            if (err) throw err;
            console.table(employeesNewRole)
          })
        })

      })
    })
  })
  start();
};


// ------------ CREATE 'ADD EMPLOYEE' FUNCTION ------------
const addEmployee = () => {
  connection.query('SELECT * FROM employeesdb.role', (err, queryResponse) => {
    if (err) throw err;

    inquirer.prompt(
      [
        {
          type: 'list',
          message: "Select the employee's role.",
          name: 'roleid',
          choices: queryResponse.map(role =>({ name: role.title, value: role.id})),
        },
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
      ])
  
    .then((response) => {
      connection.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?); SELECT employee.first_name AS 'First Name', employee.last_name AS 'Last Name' FROM employee` [response.firstName, response.lastName, response.roleid], (err, addedEmployeeData) => {
        if (err) throw err;
        console.table(addedEmployeeData);
      })
    })
  })
  start();
};


// ------------ CREATE 'ADD DEPARTMENT' FUNCTION ------------
const addDepartment = () => {
  inquirer.prompt(
    {
      type: 'input',
      message: 'What is the name of the department?',
      name: 'name',
    }
  )
  .then((addedDepartmentData) => {
    connection.query(`INSERT INTO department (name) VALUES (?)`, [addedDepartmentData.name], (err, newDepartment) => {
      if (err) throw err;
      console.table(newDepartment);
    })
  })
  start();
};


// ------------ CREATE 'ADD ROLE' FUNCTION ------------
const addRole = () => {
  connection.query(`SELECT * FROM department`, (err, departmentTable) => {
    if (err) throw err;
    
    inquirer.prompt(
      [
        {
          type: 'input',
          message: 'What is the title of the role?',
          name: 'title',
        },
        {
          type: 'number',
          message: 'What is the salary of this role?',
          name: 'salary',
        },
        {
          type: 'list',
          message: 'What department does this role belong to?',
          name: 'departmentid',
          choices: departmentTable.map(department => ({name: department.name, value: department.id})),
        }
      ]
    )
    .then((addedRole) => {
      connection.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?); SELECT title as 'Title', salary as 'Salary', department_id as 'Department'`, [addedRole.title, addedRole.salary, addedRole.department_id], (err, roleTable) => {
        if (err) throw err;
        console.table(roleTable);
      })
    })
  })
  start();
};

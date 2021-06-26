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
      case 'View All Employees by Department': // WORKING!!!!!!!!!!!
        await viewEmployeesByDepartment()
        break;
      case 'View All Employees by Role': // WORKING!!!!!!
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
      case 'Add Employee': // WORKING!!!!!!!!!!!!!
        await addEmployee()
        break;
      case 'Add Department': // WORKING !!!!!!!!!
        await addDepartment()
        break;
      case 'Add Role':  // WORKING!!!!!!
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
  const queryResponse = await connection.query('SELECT * FROM employeesdb.department')
    

  // ASK USER THEN TO SELECT FROM LIST OF DEPTS
//MAP THE OBJECT FROM QUERY RESPONSE TO AVOID HARD CODING AND WILL INCLUDE ANY ADDED DEPTS FROM USER ------> SEE COMMENT '$$$'
  const deptChoice = await inquirer.prompt(
      {
        type: 'list',
        message: 'View employees by which department?',
        name: 'departmentName',
        choices: queryResponse.map(department => ({ value: department.id, name: department.name })) // $$$
      })
      
  const chosenDeptData = await connection.query(`SELECT employee.first_name AS 'First Name', employee.last_name AS 'Last Name', department.name AS 'Department' FROM employee LEFT JOIN employeesdb.role on employee.role_id = role.id LEFT JOIN employeesdb.department ON department.id = role.department_id WHERE department.id = ?`, [deptChoice.departmentName])
        console.table(chosenDeptData);
        start();
}


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

  const chosenRoleData = await connection.query(`SELECT employee.first_name as 'First Name', employee.last_name as 'Last Name', role.title as 'Title', role.salary as 'Salary' FROM employee, role WHERE employee.role_id = role.id AND employee.role_id = ?`, [roleChoice.roleid])
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
const updateEmployeeRole = async () => {

  const employeeTable = await connection.query(`SELECT * FROM employee`)
    
  const chosenEmployee = await inquirer.prompt(
    {
      type: 'list',
      message: 'Which employees role is getting changed?',
      name: 'employeeid',
      choices: employeeTable.map(employee => ({name: employee.first_name + " " + employee.last_name, value: employee.id }))
    }
  )
    
  const roleTable = await connection.query(`SELECT * FROM role`)
    

  const updatedRole = await inquirer.prompt(
    {
      type:'list',
      message: 'What is the title of the new role?',
      name: 'roleid',
      choices: roleTable.map(role => ({ name: role.title, value: role.id}))
    })

  
  await connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [updatedRole.roleid, chosenEmployee.employeeid])

  const employeesNewRole = await connection.query(`SELECT employee.first_name as 'First Name', employee.last_name as 'Last Name', role.title AS 'Title', department.name AS 'Department' from employee, role, department WHERE employee.role_id = role.id AND role.department_id = department.id`)
  console.table(employeesNewRole)

  console.log(updatedRole.roleid)       
  start();
};


// ------------ CREATE 'ADD EMPLOYEE' FUNCTION ------------
const addEmployee = async () => {
  const queryResponse = await connection.query('SELECT * FROM employeesdb.role')

  const response = await inquirer.prompt(
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
  
    await connection.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES (?, ?, ?); `, [response.firstName, response.lastName, response.roleid])

    const addedEmployeeData = await connection.query(`SELECT employee.first_name AS 'First Name', employee.last_name AS 'Last Name' FROM employee`)
        console.table(addedEmployeeData);
        start();
};


// ------------ CREATE 'ADD DEPARTMENT' FUNCTION ------------
const addDepartment = async () => {
  const addedDepartmentData = await inquirer.prompt(
    {
      type: 'input',
      message: 'What is the name of the department?',
      name: 'name',
    }
  )
  
  await connection.query(`INSERT INTO department (name) VALUES (?)`, [addedDepartmentData.name])

  const newDepartment = await connection.query(`SELECT * from department`)
  
  console.log(`Success! ${addedDepartmentData.name} added as a new department to the database.`)  
  console.table(newDepartment);
    start();
};


// ------------ CREATE 'ADD ROLE' FUNCTION ------------
const addRole = async () => {
   const departmentTable = await connection.query(`SELECT * FROM department`)
    
   const addedRole = await inquirer.prompt(
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
    
    await connection.query(`INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`, [addedRole.title, addedRole.salary, addedRole.departmentid])

    const roleTable = await connection.query(`SELECT title as 'Title', salary as 'Salary', department.name as 'Department' FROM role, department WHERE role.department_id = department.id`)
        console.log(`Success! New role has been added to database.`)
        console.table(roleTable);

    start();
};

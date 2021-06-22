drop database if exists employeesdb;

create database employeesdb;
use employeesdb;

create table department (
	id integer not null auto_increment,
    name varchar(30) not null,
    primary key (id)
);

create table role (
	id integer not null auto_increment,
    title varchar(30) not null,
    salary decimal not null,
    department_id int not null,
    foreign key (department_id) references department(id),
    primary key (id)
);

create table employee (
	id integer not null auto_increment,
	first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id integer not null,
    manager_id integer,
    foreign key (role_id) references role(id),
    foreign key (manager_id) references role(id),
    primary key (id)
);

insert into department (name)
values ('Sales'), ('Accounting');

insert into role (title, salary, department_id)
values ('Associate', 1000, 1), ('Accountant', 2000, 2);

insert into employee (first_name, last_name, role_id)
values ('Harry', 'Potter', 1), ('Ron', 'Weasley', 1), ('Hermione', 'Granger', 2);

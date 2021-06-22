drop database if exists employeesdb;

create database employeesdb;
use employeesdb;

create table department (
	id integer not null auto_increment,
    name varchar(30),
    primary key (id)
);

create table role (
	id integer not null auto_increment,
    title varchar(30),
    salary decimal,
    department_id int,
    foreign key (department_id) references department(id),
    primary key (id)
    
);

create table employee (
	id integer not null auto_increment,
	first_name varchar(30),
    last_name varchar(30),
    role_id integer,
    manager_id integer,
    foreign key (role_id) references role(id),
    foreign key (manager_id) references role(id),
    primary key (id)
);
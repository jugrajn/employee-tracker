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
values ('Board'), ('Engineering'), ('Security');

insert into role (title, salary, department_id)
values ('Chairman', 1000000, 1), ('CEO', 500000, 1), ('Head of Security', 100000, 3), ('Intern', 50000, 2);

insert into employee (first_name, last_name, role_id)
values ('Tony', 'Stark', 1), ('Pepper', 'Potts', 2), ('Happy', 'Hogan', 3), ('Peter', 'Parker', 4);

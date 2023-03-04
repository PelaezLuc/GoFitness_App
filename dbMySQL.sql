CREATE DATABASE IF NOT EXISTS go_fitness;
USE go_fitness;

DROP TABLE IF EXISTS likes;
DROP TABLE IF EXISTS favorite;
DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS workout;

CREATE TABLE IF NOT EXISTS user (
	id int not null primary key auto_increment,
	name varchar(50) not null,
	email varchar(100) not null,
	password varchar(255) not null,
	role bool default(0) not null 
);

CREATE TABLE IF NOT EXISTS workout (
	id int not null primary key auto_increment,
	name varchar(50) not null,
	type varchar(50) not null,
	description text not null,
	muscle_group varchar(50) not null,
	photo varchar(255)
);

CREATE TABLE IF NOT EXISTS likes(
	id_likes int not null primary key auto_increment,
	id_user int not null,
	foreign key (id_user) references user(id),
	id_workout int not null,
	foreign key (id_workout) references workout(id)
);

CREATE TABLE IF NOT EXISTS favorite(
	id_favorite int not null primary key auto_increment,
	id_user int not null,
	foreign key (id_user) references user(id),
	id_workout int not null,
	foreign key (id_workout) references workout(id)
);







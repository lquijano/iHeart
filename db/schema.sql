DROP DATABASE IF EXISTS fitTracker;

CREATE DATABASE fitTracker;

USE fitTracker;


CREATE TABLE users(
 id INT NOT NULL AUTO_INCREMENT,
 name VARCHAR(45) NOT NULL,
 lastname VARCHAR(45) NOT NULL,
 cellphone INT NOT NULL,
 email VARCHAR(45) NOT NULL UNIQUE,
 PASSWORD VARCHAR(45) NOT NULL,
 contact VARCHAR(45) NOT NULL,
 telephone INT NOT NULL,
 PRIMARY KEY (id)
);

CREATE TABLE heartRate(
id INT NOT NULL AUTO_INCREMENT,
heartRateUser_id INT NOT NULL,
heartRate INT NOT NULL,
PRIMARY KEY (id),
FOREIGN KEY (heartRateUser_id) REFERENCES users(id)
);

-- CREATE TABLE users(
--  id INT NOT NULL AUTO_INCREMENT,
--  name VARCHAR(45) NOT NULL,
--  lastname VARCHAR(45) NOT NULL,
--  cellphone INT NOT NULL,
--  email VARCHAR(45) NOT NULL UNIQUE,
--  PASSWORD VARCHAR(45) NOT NULL,
--  PRIMARY KEY (id)
-- );

-- CREATE TABLE firstResponse(
--  id INT NOT NULL AUTO_INCREMENT,
--  user_id  INT NOT NULL,
--  name VARCHAR(45) NOT NULL,
--  lastName VARCHAR(45) NOT NULL,
--  relationship VARCHAR(45) NOT NULL,
--  cellphone INT NOT NULL,
--  PRIMARY KEY (id),
--  FOREIGN KEY (user_id) REFERENCES users(id)










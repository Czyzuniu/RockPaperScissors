CREATE DATABASE IF NOT EXISTS RPS;

USE RPS;

CREATE TABLE IF NOT EXISTS RPS.USERS (
  Id INT PRIMARY KEY auto_increment,
  OnlineId VARCHAR(25),
  Password VARCHAR(25),
  SessionId VARCHAR(50),
  profilepic VARCHAR(25)
)charset 'utf8mb4';


CREATE TABLE IF NOT EXISTS RPS.REQUESTS (
  Id INT PRIMARY KEY auto_increment,
  OnlineIdFrom VARCHAR(25),
  OnlineIdTo VARCHAR(25),
  Responded Boolean,
)charset 'utf8mb4';

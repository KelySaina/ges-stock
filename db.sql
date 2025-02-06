-- Create Database
CREATE DATABASE stock_management;
USE stock_management;

-- Users Table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL
);

-- Roles Table
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(20) UNIQUE NOT NULL
);

-- User Roles Table
CREATE TABLE user_roles (
  user_id INT,
  role_id INT,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Permissions Table
CREATE TABLE permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- Role Permissions Table
CREATE TABLE role_permissions (
  role_id INT,
  permission_id INT,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (permission_id) REFERENCES permissions(id)
);

-- Articles Table
CREATE TABLE articles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Stock Transactions Table
CREATE TABLE stock_transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  article_id INT,
  quantity INT NOT NULL,
  type ENUM('in', 'out') NOT NULL,
  user_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (article_id) REFERENCES articles(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Stock Current Table
CREATE TABLE stock_current (
  article_id INT PRIMARY KEY,
  quantity INT NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (article_id) REFERENCES articles(id)
);

-- Trigger to Update Stock on Transactions
DELIMITER $$
CREATE TRIGGER update_stock_after_transaction
AFTER INSERT ON stock_transactions
FOR EACH ROW
BEGIN
  IF NEW.type = 'in' THEN
    INSERT INTO stock_current (article_id, quantity)
    VALUES (NEW.article_id, NEW.quantity)
    ON DUPLICATE KEY UPDATE
    quantity = quantity + NEW.quantity;
  ELSE
    INSERT INTO stock_current (article_id, quantity)
    VALUES (NEW.article_id, -NEW.quantity)
    ON DUPLICATE KEY UPDATE
    quantity = quantity - NEW.quantity;
  END IF;
END$$
DELIMITER ;

-- Insert Initial Roles and Permissions
INSERT INTO roles (name) VALUES ('admin'), ('manager'), ('employee');

INSERT INTO permissions (name) VALUES
  ('view_stock'),
  ('view_history'),
  ('manage_users'),
  ('manage_articles'),
  ('perform_transactions');

-- Assign Permissions to Roles
INSERT INTO role_permissions (role_id, permission_id) VALUES
  (1, 1), (1, 2), (1, 3), -- Admin
  (2, 1), (2, 2), (2, 4), -- Manager
  (3, 1), (3, 5);         -- Employee
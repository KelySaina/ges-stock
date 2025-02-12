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

ALTER TABLE users ADD COLUMN isRestricted TINYINT(1) NOT NULL DEFAULT 0;

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
  old_quantity INT NOT NULL,
  quantity INT NOT NULL,
  type ENUM('in', 'out') NOT NULL,
  operation VARCHAR (50) NULL,
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
    last_user_updated INT NULL,
    FOREIGN KEY (article_id) REFERENCES articles(id)
);

-- Trigger to Update Stock on Transactions
DROP TRIGGER IF EXISTS update_stock_after_transaction; 

DELIMITER $$

CREATE TRIGGER update_stock_after_transaction
AFTER UPDATE ON stock_current
FOR EACH ROW
BEGIN
  -- Check if quantity increased (Stock In)
  IF NEW.quantity > OLD.quantity THEN
    INSERT INTO stock_transactions (article_id, old_quantity, quantity, type, operation, user_id, created_at)
    VALUES (NEW.article_id, OLD.quantity ,NEW.quantity - OLD.quantity, 'in', 'UPDATE', NEW.last_user_updated, NOW());
  END IF;
  
  -- Check if quantity decreased (Stock Out)
  IF NEW.quantity < OLD.quantity THEN
    INSERT INTO stock_transactions (article_id, old_quantity, quantity, type, operation, user_id, created_at)
    VALUES (NEW.article_id, OLD.quantity ,OLD.quantity - NEW.quantity, 'out', 'UPDATE', NEW.last_user_updated, NOW());
  END IF;
END$$

DELIMITER ;

-- Trigger to Update Stock on Insert article
DROP TRIGGER IF EXISTS update_stock_after_insert; 

DELIMITER $$

CREATE TRIGGER update_stock_after_insert
AFTER INSERT ON stock_current
FOR EACH ROW
BEGIN
  INSERT INTO stock_transactions (article_id, old_quantity, quantity, type, operation, user_id, created_at)
  VALUES (NEW.article_id, 0 ,NEW.quantity, 'in', 'INSERT', NEW.last_user_updated, NOW());
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

-- Insert Admin User
INSERT INTO users (username, password_hash, email) 
VALUES ('admin', '$2a$10$6GEB2JQ4Z.oTBkmiCbnMXOMPBe0R5Zgaws3r9OLg8H.qRhF44Zbpq', 'admin@example.com');

-- Get Admin User ID
SET @admin_id = LAST_INSERT_ID();

-- Get Admin Role ID
SET @admin_role_id = (SELECT id FROM roles WHERE name = 'admin');

-- Assign Admin Role to User
INSERT INTO user_roles (user_id, role_id) VALUES (@admin_id, @admin_role_id);

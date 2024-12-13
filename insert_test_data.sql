INSERT INTO users (username, email, password_hash) 
VALUES ('TestingUser', 'testing.user@example.com', 'hashed_password');

INSERT INTO categories (user_id, category_name) 
VALUES (1, 'Rent');

INSERT INTO transactions (user_id, category_id, amount, transaction_date, description) 
VALUES (1, 1, 50.00, '2024-12-03', 'Grocery shopping');

INSERT INTO budgets (user_id, category_id, budget_limit, start_date, end_date) 
VALUES (1, 1, 500.00, '2024-12-01', '2024-12-31');

CREATE DATABASE personalFinanceTracker;
USE personalFinanceTracker;

CREATE TABLE users (
  user_id int AUTO_INCREMENT PRIMARY KEY,
  username varchar(50) NOT NULL,
  name varchar(45) NOT NULL,
  email varchar(100) NOT NULL UNIQUE,
  password_hash varchar(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
)

CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT,
    amount DECIMAL(10,2) NOT NULL,
    transaction_date DATE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (user_id) REFRENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
)

SELECT * 
FROM transactions 
WHERE user_id = 2;
SELECT * 
FROM categories 
WHERE user_id = 2;

INSERT INTO categories (user_id, category_name)
VALUES 
    (1, 'Groceries'),
    (1, 'Rent'),
    (1, 'Utilities'),
    (1, 'Entertainment');

SELECT * FROM categories;
DELETE FROM categories WHERE user_id = 1;

SELECT * FROM transactions;
ALTER TABLE transactions MODIFY transaction_date DATE;

INSERT INTO categories (user_id, category_name)
VALUES (1, 'Groceries');
INSERT INTO transactions (user_id, category_id, amount, transaction_date, description)
VALUES (1, 1, 100.50, '2024-12-12', 'Grocery shopping');


CREATE TABLE budgets (
    budget_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    budget_limit DECIMAL(10, 2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE
);

CREATE TABLE reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    report_type VARCHAR(50) NOT NULL, -- e.g., "monthly", "yearly"
    report_data JSON NOT NULL,        -- Stores detailed report data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

GRANT ALL PRIVILEGES ON personalFinanceTracker.* TO 'user'@'localhost';
FLUSH PRIVILEGES;

SELECT user, host FROM mysql.user WHERE user = 'user';
CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';

DESCRIBE users;
SELECT * FROM users;
SELECT * FROM transactions WHERE user_id = 23;
SELECT * FROM transactions WHERE type = 'income';

SELECT * FROM reports
        WHERE user_id = 23;
        ORDER BY created_at DESC;


DELETE FROM users WHERE user_id = 22;
SELECT MAX(user_id) AS max_id FROM users;

SELECT * FROM transactions WHERE user_id = 2;
INSERT INTO transactions (description, amount, type, category_id, user_id, transaction_date) VALUES ('Rent', 800, 'expense', NULL, 2, '2024-12-12');
SHOW TABLE STATUS LIKE 'users';
ALTER TABLE transactions ADD COLUMN type ENUM('income', 'expense') NOT NULL;
ALTER TABLE transactions RENAME COLUMN transcation_date TO transaction_date;
SELECT user_id FROM users WHERE username = 'FahmidaG';

SELECT user_id, username, name, email FROM users;
INSERT INTO users (username, name, email, password_hash)
VALUES ('johndoe', 'John Doe', 'johndoe@example.com', 'samplehash');


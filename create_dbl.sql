CREATE DATABASE personalFinanceTracker;
USE personaFinanceTracker;

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

INSERT INTO categories (user_id, category_name)
VALUES 
    (1, 'Groceries'),
    (1, 'Rent'),
    (1, 'Utilities'),
    (1, 'Entertainment');


CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT,
    amount DECIMAL(10,2) NOT NULL,
    transcation_date DATE NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (user_id) REFRENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
)

CREATE TABLE reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    report_type VARCHAR(50) NOT NULL, -- e.g., "monthly", "yearly"
    report_data JSON NOT NULL,        -- Stores detailed report data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

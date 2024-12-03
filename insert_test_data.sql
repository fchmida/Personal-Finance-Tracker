INSERT INTO users (username, email, password_hash) 
VALUES ('TestingUser', 'testing.user@example.com', 'hashed_password');

INSERT INTO categories (user_id, category_name) 
VALUES (1, 'Rent');

INSERT INTO transactions (user_id, category_id, amount, transaction_date, description) 
VALUES (1, 1, 50.00, '2024-12-03', 'Grocery shopping');

INSERT INTO budgets (user_id, category_id, budget_limit, start_date, end_date) 
VALUES (1, 1, 500.00, '2024-12-01', '2024-12-31');

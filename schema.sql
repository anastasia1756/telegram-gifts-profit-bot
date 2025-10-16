CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  gift_id INT,
  number VARCHAR(50),
  type ENUM('buy', 'sell'),
  price DECIMAL(10, 3),
  date DATETIME,
  FOREIGN KEY (gift_id) REFERENCES gifts(id)
);

CREATE TABLE daily_profit (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE UNIQUE,
  daily_profit DECIMAL(10, 3),
  monthly_profit DECIMAL(10, 3),
  calculated_at DATETIME
);


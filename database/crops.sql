
DROP TABLE crops;
CREATE TABLE crops (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  quantity INT,
  price DECIMAL(10, 2),
  description TEXT
);


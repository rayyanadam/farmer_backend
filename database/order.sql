DROP TABLE orders;
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(255) NOT NULL,
  quantity INT,
  price DECIMAL(10, 2),
  address VARCHAR(255),
  phone_number VARCHAR(255)
);

INSERT INTO orders (name, quantity, price, address, phone_number)
VALUES ('Casava', 3, 2500, 'k/Samaki', '0719773674');

INSERT INTO orders (name, quantity, price, address, phone_number)
VALUES ('Banana', 1, 20000, 'Fuoni', '0245197600');

INSERT INTO orders (name, quantity, price, address, phone_number)
VALUES ('Lemon', 1, 1000, 'kwerekwe', '0734671266');

INSERT INTO orders (name, quantity, price, address, phone_number)
VALUES ('Tomato', 1, 2500, 'Michenzani', '0634873250');

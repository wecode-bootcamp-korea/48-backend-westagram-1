-- migrate:up
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    password VARCHAR(2000) NULL,
    email VARCHAR(1000) NULL
);

-- migrate:down
DROP TABLE users;
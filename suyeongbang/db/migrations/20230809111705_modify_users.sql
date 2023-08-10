-- migrate:up
ALTER TABLE users MODIFY COLUMN email VARCHAR(200) UNIQUE;

-- migrate:down
DROP TABLE users;

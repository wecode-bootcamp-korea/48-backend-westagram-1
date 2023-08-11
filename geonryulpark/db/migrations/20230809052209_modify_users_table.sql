-- migrate:up
ALTER TABLE users add (
    CONSTRAINT user_mail_ukey UNIQUE (email)
);

-- migrate:down
DROP TABLE users;
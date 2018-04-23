DROP TABLE IF EXISTS images;
CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR(300) NOT NULL,
    username VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    username VARCHAR(200) NOT NULL,
    comment TEXT NOT NULL,
    image_id INTEGER REFERENCES images (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE likes(
    id SERIAL PRIMARY KEY,
    count INTEGER not null,
    image_id INTEGER REFERENCES images (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE tags(
    id SERIAL PRIMARY KEY,
    tag VARCHAR(20) NOT NULL,
    image_id INTEGER REFERENCES images (id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/spicedling/MQwozP4QM5uK84XgPs4Q0oUIVWiwzN-w.jpg',
    'funkychicken',
    'Welcome to Berlin and the future!',
    'This photo brings back so many great memories.'
);
INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/spicedling/wg8d94G_HrWdq7bU_2wT6Y6F3zrX-kej.jpg',
    'discoduck',
    'Elvis',
    'We can''t go on together with suspicious minds.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/spicedling/XCv4AwJdm6QuzjenFPKJocpipRNNMwze.jpg',
    'discoduck',
    'Hello Berlin',
    'This is going to be worth a lot of money one day.'
);

INSERT INTO comments (username, comment, image_id) VALUES (
    'taherjaoui',
    'Comment 111',
    1
);
INSERT INTO comments (username, comment, image_id) VALUES (
    'taherjaoui',
    'Comment 222',
    1
);
INSERT INTO likes (count, image_id) VALUES (
    1,
    1
);
INSERT INTO tags (tag, image_id) VALUES (
    'toto',
    1
);
INSERT INTO tags (tag, image_id) VALUES (
    'miro',
    1
);
INSERT INTO tags (tag, image_id) VALUES (
    'toto elvis',
    2
);
INSERT INTO tags (tag, image_id) VALUES (
    'miro elvis',
    2
);

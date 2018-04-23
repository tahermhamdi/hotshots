var spicedPg = require("spiced-pg");

if (process.env.DATABASE_URL) {
    var db = spicedPg(process.env.DATABASE_URL);
} else {
    var db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");
}
function getModalById(id) {

    return db.query(
        "SELECT images.url AS url, images.username AS username, images.title AS title," +
            "images.description AS description," +
            "comments.comment AS comment, comments.username AS commentUsername, comments.created_at AS created_at " +
            "FROM images JOIN comments " +
            "ON images.id = comments.image_id AND images.id = $1" +
            "UNION "+
            "SELECT images.url AS url, images.username AS username, images.title AS title," +
                "images.description AS description," +
                "null AS comment, null AS commentUsername,null AS created_at " +
                "FROM images "+
                "WHERE images.id = $1 " +
                "ORDER BY created_at DESC",[id]
    );
}
function getImages() {
    return db.query("SELECT images.id as id, images.username as username, images.title as title, images.url as url, " +
    "(select count(*) from comments where comments.image_id = images.id) as commentscount, "+
    "(select sum(count) from likes where likes.image_id = images.id) as likescount, "+
    "images.description as description, images.created_at as created_at FROM images ORDER BY id");
}
function setImage(url, username, title, description) {
    return db.query(
        "INSERT INTO IMAGES (url,username,title,description) VALUES ($1,$2,$3,$4) RETURNING id",
        [url, username, title, description]
    );
}
function getLikesById(imageid) {
    return db.query(
        "SELECT SUM(count) as count FROM likes WHERE likes.image_id = $1",
        [imageid]
    );
}
function getLikes() {
    return db.query(
        "SELECT SUM(count) as count FROM likes"
    );
}
function setLike(imageid) {
    return db.query(
        "INSERT INTO LIKES (count,image_id) VALUES (1,$1) RETURNING id",
        [imageid]
    );
}
function getCommentsById(imageid) {
    return db.query(
        "SELECT COUNT(*) as count FROM comments WHERE comments.image_id = $1",
        [imageid]
    );
}
function setComment(comment, username, imageid) {
    return db.query(
        "INSERT INTO COMMENTS (comment,username,image_id) VALUES ($1,$2,$3) RETURNING id",
        [comment, username, imageid]
    );
}
function setTag(tag, imageid) {
    return db.query(
        "INSERT INTO tags (tag,image_id) VALUES ($1,$2) RETURNING id",
        [tag, imageid]
    );
}
function getTagsById(imageid) {
    return db.query(
        "SELECT string_agg(tag,' ') as tags from tags WHERE image_id=$1 ",
        [imageid]
    );
}
exports.getModalById = getModalById;
exports.getImages = getImages;
exports.setImage = setImage;
exports.getLikesById = getLikesById;
exports.getLikes = getLikes;
exports.setLike = setLike;
exports.getTagsById = getTagsById;
exports.setTag = setTag;
exports.getCommentsById = getCommentsById;
exports.setComment = setComment;

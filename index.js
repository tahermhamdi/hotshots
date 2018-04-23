const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const db = require("./db");
app.use(bodyParser.json());
app.use(express.static("./public"));

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");

const config = require("./config");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
app.get("/images", function(req, res) {
    db.getImages().then(response => {
        res.json(response.rows);
    });
});
app.get("/modal", function(req, res) {
    db.getModalById(req.query.imageid).then(response => {
        res.json(response.rows);
    });
});
app.get("/likescount", function(req, res) {
    db.getLikes().then(response => {
        res.json(response.rows);
    });
});
app.post("/upload", uploader.single("image"), s3.upload, function(req, res) {
    if (req.file) {
        const imageUrl = config.s3Url + "taher/" + req.file.filename;

        db
            .setImage(
                imageUrl,
                req.body.username,
                req.body.title,
                req.body.description
            )
            .then(response => {
                 if (response.data.success) {
                     app.images.unshift(response.data.image);
                 }
            });
        res.json({
            sucess: true,
            data: {
            }
        });
    } else {
        console.log("ERROR");
    }
});
app.post("/submit", function(req, res) {
    db
            .setComment(
                req.body.comment,
                req.body.usernamecomment,
                req.query.imageid
            )
            .then(() => {});
});
app.get("/likes", function(req, res) {
    console.log("likesmodal");
   db
            .getLikesById(req.query.imageid)
            .then(response => {
                res.json(response.rows);
            });
});
app.get("/comments", function(req, res) {
    console.log("commentsmodal");
   db
            .getCommentsById(req.query.imageid)
            .then(response => {
                res.json(response.rows);
            });
});
app.post("/submitlike", function(req, res) {
    db
            .setLike(req.query.imageid)
            .then(response => {
                res.json(response.rows);
            });
});
app.get("/tags", function(req, res) {
    db
            .getTagsById(req.query.imageid)
            .then(response => {
                res.json(response.rows);
            });
});
app.post("/tags", function(req, res) {
    db
            .setTag(req.body.tag, req.query.imageid)
            .then(response => {
                res.json(response.rows);
            });
});
app.post("/like", function(req, res) {
    db
            .setLike(
                req.query.imageid
            )
            .then(() => {
            });
});
app.listen(8080, () => {
    console.log(`I'm listening.`);
});

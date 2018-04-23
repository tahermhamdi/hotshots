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
    //where to put the file pass the request object, the file and the callback and the name
    //of the directory
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    //how to name the file, file name and the callback
    //pass the number of the bits and it return a promess with an unique id (uid)
    //
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
app.post("/upload", uploader.single("image"), s3.upload, function(req, res) {
    if (req.file) {
        console.log("success", req.file, req.body);
        //insert the file in the DATABASE
        //
        //
        //request.body.title, request.body.description, request.body.username;
        const imageUrl = config.s3Url + "taher/" + req.file.filename;

        db
            .setImage(
                imageUrl,
                req.body.username,
                req.body.title,
                req.body.description
            )
            .then(() => {
                // if (resp.data.success) {
                //     app.images.unshift(resp.data.image);
                // }
            });
        res.json({
            sucess: true,
            data: {
                // url: myAmazonUrl + req.file.filename,
                // title: req.body.title
            }
        });
    } else {
        console.log("ERROR");
    }
    //field depend on the name you append it
});
app.listen(8080, () => {
    console.log(`I'm listening.`);
});
//
// uploading images
// Using Http
// post request because we send stuff.. file part of the body
// multipart format will be sent to the
// server assemble all the parts and send them
// use middleware multer for this
// complication also on the browser side
// file filed dont work with AJAX
// form data
// using S3 to store the getImages better than public/uploads
// losing the files on every deploy
// centralized the store and with stablized url
//
// & IAM webservices on amazon

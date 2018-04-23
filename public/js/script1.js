// multer is for file parsering
// uid-safe generates an unique id garanti to be unique for the image names
//
// focus on client side, we are using vuejs for this, backbone a framework
// we are using vue because vue is kind
// vue is growing
(function() {
    Vue.component('modal', {
        template: '#modal-template'
    })
    Vue.component("individual-city", {
        //don't give a component an el
        /* data, methods, etc. go here */
        props: ["id", "name", "country", "chicken"],
        template:
            '<span v-on:click="causeDeletion">{{name}}, {{country}}, {{chicken}}</span>',
        methods: {
            causeDeletion: function() {
                this.$emit("del", this.id);
            }
        }
    });
    Vue.component("image-modal", {
        props: ["id", "title", "description", "url"],
        template:
            '#image-modal-tmpl',
        mounted: function() {
            var app = this;
            axios.get("/image").then(function(response) {
                app.image = response.data[0];
            });
        },
        methods: {

        }
        //mounted:
        //x the parent has to close the modal
    });

    Vue.component("image-detail", {
        props: ["id", "title", "description", "url"],
        template:
            '<span v-on:click="causeShow">{{title}}</span>',
        methods: {
            causeShow: function() {
                this.$emit("show", this.id);
            }
        }

    });
    Vue.component("comment-modal", {
        props: ["id", "comment", "username"],
        template:
            '#comment-modal-tmpl',
        mounted: function() {
            var app = this;
            axios.get("/image").then(function(response) {
                app.image = response.data[0];
            });
        },
        methods: {
            causeComment: function() {
                this.$emit("causeComment", this.id);
            },
            submit: function() {
                var formData = new FormData();
                formData.append("comment", this.commentToSubmit.comment);
                formData.append("username", this.commentToSubmit.username);
                var app = this;
                axios.post("/submit", formData).then(function(resp) {
                    if (resp.data.success) {
                        console.log("success");
                    }
                });
            },
        }
        //mounted:
        //x the parent has to close the modal
    });
    new Vue({
        el: "#main",
        data: {
            fileToUpload: {},
            chicken: "FUNKY",
            images: [],
            image: [],
            currentImageId: null,
            cities: [
                {
                    id: 1,
                    name: "Berlin",
                    country: "Germany"
                },
                {
                    id: 2,
                    name: "Hamburg",
                    country: "Germany"
                }
            ]
        },
        mounted: function() {
            var app = this;
            axios.get("/images").then(function(response) {
                app.images = response.data;
            });
        },
        methods: {
            setFile: function(e) {
                this.fileToUpload.file = e.target.files[0];
                //console.log(this.fileToUpload);
            },
            upload: function() {
                var formData = new FormData();
                formData.append("image", this.fileToUpload.file);
                formData.append("title", this.fileToUpload.title);
                formData.append("description", this.fileToUpload.description);
                formData.append("username", this.fileToUpload.username);
                var app = this;
                axios.post("/upload", formData).then(function(resp) {
                    if (resp.data.success) {
                        app.images.unshift(resp.data.image);
                    }
                });
            },
            del: function(id) {
                this.cities = this.cities.filter(city => city.id != id);
            },
            show: function(id) {
                this.currentImageId = id;
                console.log("this.currentImageId "+this.currentImageId );
            },
            comment: function(id) {
                this.currentImageId = id;
            },
            setCurrentImageToNull: function() {
                this.currentImageId = null;
            }
        }
    });
})();
///
// like instagram
//only one big account
// no log in
//are of uploading
// title Description Username
// file
// Uplaod button
// We show the images, the most recent image by DateWhey you click on the image is a big page with
// the image and you can add a comment on the image
// create a vue instance, the root should bring back in json from the images and the browser should show
// all the optionMergeStrategies
// Use the SQL file
//put the image in a bucket
// think about the more button & pagination
// organise images by id
// <input type="file" name="file">
// formData is used because of the file use
//
//

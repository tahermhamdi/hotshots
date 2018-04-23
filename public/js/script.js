(function() {

    Vue.component("image-modal", {
        props: ["imageid","likesmodal","commentsmodal","tagsmodal","tags"],
        data: function () {
            return {
              comments: [],
              commentToSubmit: {},
              tagToSubmit: {}
             }
        },
        template:
            '#image-modal-tmpl',
        methods: {
            submit: function() {
                var mdl = this;
                var formData = new FormData();

                formData.append("comment", mdl.commentToSubmit.comment);
                formData.append("usernamecomment", mdl.commentToSubmit.usernamecomment);
                axios.post("/submit?imageid="+this.imageid, {
                    comment : mdl.commentToSubmit.comment,
                    usernamecomment : mdl.commentToSubmit.usernamecomment}).then(function(resp) {
                    axios.get("/comments?imageid="+this.imageid).then(function(response,data) {
                        mdl.commentsmodal = response.data[0].count;
                    });
                    axios.get("/modal?imageid=" + this.imageid).then(function(response,data) {
                        mdl.comments = response.data;
                   });
                });
                document.getElementById("commentform").style.display = "none";

            },
            submitTag: function() {
                var mdl = this;
                var formData = new FormData();

                formData.append("tag", mdl.tagToSubmit.tag);
                axios.post("/tags?imageid="+this.imageid, {
                    tag : mdl.tagToSubmit.tag}).then(function(resp) {
                    if (resp.data.success) {

                    }
                    document.getElementById("tagform").style.display = "none";
                });
            },
            submitlike: function() {
                var mdl = this;
                axios.post("/submitlike?imageid="+this.imageid).then(function(resp) {
                    //if (resp.data) {
                        axios.get("/likes?imageid="+mdl.imageid).then(function(response,data) {
                            mdl.likesmodal = response.data[0].count;
                        });
                    //}
                });
            },
            causeclose: function() {
                this.$emit("xclose");
            },
            getimagebyid: function(){
                var mdl=this;
                axios.get("/modal?imageid=" + this.imageid).then(function(response,data) {
                    mdl.comments = response.data;
               });
               axios.get("/tags?imageid=" + this.imageid).then(function(response,data) {
                   mdl.tag = response.data;
              });

            }
        },
         mounted: function(){
             var mdl = this;
             mdl.imageid = location.hash.slice(1);
             mdl.getimagebyid();
             axios.get("/modal?imageid="+this.imageid).then(function(response,data) {
                 mdl.comments = response.data;
             });
             axios.get("/tags?imageid="+this.imageid).then(function(response,data) {
                 mdl.tags = response.data[0].tags;
                 console.log(mdl.tags);
            });
            axios.get("/likes?imageid="+this.imageid).then(function(response,data) {
                mdl.likesmodal = response.data[0].count;
            });
            axios.get("/comments?imageid="+this.imageid).then(function(response,data) {
                mdl.commentsmodal = response.data[0].count;
            });
        },
        watch: {
            imageid: function(){
                //function run each time the
                this.getimagebyid();
                //div v-for image in IMAGE
                // a v-bind:href="'#'+image.id> a
            }
        },
    });
    Vue.component("image-detail", {
        props: ["id", "title", "description", "url","commentscount","likescount"],
        template:
            '#image-detail-tmpl',
    });
    Vue.component("likes-count", {
        props: ["likescount"],
        template:
            '<span>{{likescount}}</span>'
    });
    new Vue({
        el: "#main",
        data: {
            fileToUpload: {},
            images: [],
            imageid: null,
            likescount: "",
            commentscount: "",
            title: "",
            likesmodal: "",
            commentsmodal: "",
            tagssmodal: ""
            ///read the id from the url
            //location.hash location.hash.slice(1);
            //instead of onclick put the href
            //hashchange
            // window.addEventListener("hashchange",function(){
            //     console.log(location.hash);
            // })
        },
        mounted: function() {
            var app = this;
            app.imageid = location.hash.slice(1);
            axios.get("/likescount").then(function(response) {
                app.likescount = response.data[0].count;
            });
            console.log("response.data");

            axios.get("/images").then(function(response) {
                console.log(response.data);
                app.images = response.data;
            });
            window.addEventListener("hashchange", function(){
                app.imageid = location.hash.slice(1);
            })
            //change close event add locationhash back to an empty string
            //change the id directly in the url is the complication
            //
        },
        methods: {
            setFile: function(e) {
                this.fileToUpload.file = e.target.files[0];
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
            show: function(id) {
                this.imageid = id;
            },
            xclose: function() {
                this.imageid = null;
                window.location.hash = '';
            }
        }
    });
})();

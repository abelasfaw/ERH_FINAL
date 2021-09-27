const Upload = require("../models/upload.model");
const Student = require("../models/student.model");
const User = require("../models/user.model");
const Admin = require("../models/admin.model");

exports.UploadFile = async (req, res) => {
    //  console.log("inside")

    const username = req.params.username;
    const { postname, title, description, department, under, academiclevel } =
        req.body;

    const file = req.file.filename;

    // console.log("inside 3")
    //   if(!postname){
    //      console.log("er1")
    //      return res.status(400).json({
    //         status:'fail',
    //         message:'name is empty'
    //      })
    //    }

    if (!file) {
        // console.log("er2")
        return res.status(400).json({
            status: "fail",
            message: "please insert the file",
        });
    }
    if (!title) {
        //  console.log("er3")
        return res.status(400).json({
            status: "fail",
            message: "please insert the title",
        });
    }

    if (!description) {
        //  console.log("er3")
        return res.status(400).json({
            status: "fail",
            message: "please insert the description",
        });
    }

    if (!department) {
        //  console.log("er3")
        return res.status(400).json({
            status: "fail",
            message: "please insert the department",
        });
    }

    // console.log("inside2")
    const uploader = await Student.findOne({ username });
    console.log("uploader ", uploader);

    let fileName = `localhost:${process.env.APP_PORT}/resource/${file}`;
    //file = fileName
    console.log(fileName);
    console.log(uploader.createdBy);
    let newUpload = new Upload({
        name: uploader.name,
        username: uploader.username,
        postname,
        file: fileName,
        title,
        description,
        department,
        under,
        academiclevel,
        uploader,
        institute: uploader.createdBy,
    });
    uploader.uploads.push(newUpload);
    // newUpload.postedBy = postedBy._id;
    //uploader.uploads = newUpload._id;
    // uploader.Update()
    // try {
    //   await Student.findByIdAndUpdate(uploader._id, {$push: {uploads: newUpload._id}}, {useFindAndModify: true})
    // }
    // catch(error){
    //   console.log(error)

    // }

    await newUpload.save();
    await uploader.save();
    res.status(200).json({
        status: "success",
        message: "post successfully uploaded",
        data: newUpload,
    });
};

exports.uploadList = async (req, res) => {
    var upload = await Upload.find({ state: "upload" });
    const total_count = { count: upload.length };
    res.json({ upload, total_count });
};

exports.postList = async (req, res) => {
    const post = await Upload.find({ state: "post" });
    res.json({ post });
};
exports.FilterpostList = async (req, res) => {
    let { departments, tags, date } = req.query;
    departments = departments
        ? { department: { $in: JSON.parse(departments) } }
        : {};
    tags = tags ? { tag: { $in: JSON.parse(tags) } } : {};
    date = date ? { date: { $gt: new Date(date) } } : {};
    const post = await Upload.find({
        state: "post",
        ...departments,
        ...date,
        ...tags,
    });
    res.json({ post });
};
exports.DeclineList = async (req, res) => {
    const history = await Upload.find({ state: "decliend", state: "post" });
    res.json({ history });
};

exports.findPostBYId = (req, res) => {
    const _id = req.params._id;
    Upload.findById(_id)
        .then((data) => {
            if (!data) res.status(404).send({ message: "id not found" + _id });
            else res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: "error retriving with id" + _id,
            });
        });
};

exports.ApprovePost = async (req, res) => {
    const postname = req.params.postname;
    // const {
    //     file,
    //     title,
    //     description,
    //     department,
    //     under,
    //     academiclevel,
    //     status,
    //     state,
    // } = req.body;

    await Upload.updateOne({ postname: postname }, { state: "post" });

    // const upload = await Upload.findOne({ postname });

    // let newPost = new Upload({
    //     postname,
    //     file,
    //     title,
    //     description,
    //     department,
    //     under,
    //     academiclevel,
    //     status,
    //     state,
    // });

    // newPost.upload = upload._id;
    // upload.Upload = newPost._id;

    // await upload.save();
    // await newPost.save();

    res.status(200).json({
        status: "success",
        message: "successfully approved",
    });
};

exports.DeclinePost = async (req, res) => {
    const postname = req.params.postname;
    // const {
    //     file,
    //     title,
    //     description,
    //     department,
    //     under,
    //     academiclevel,
    //     status,
    //     state,
    // } = req.body;

    await Upload.updateOne({ postname: postname }, { state: "declined" });

    // const upload = await Upload.findOne({ postname });

    // let newPost = new Upload({
    //     postname,
    //     file,
    //     title,
    //     description,
    //     department,
    //     under,
    //     academiclevel,
    //     status,
    //     state,
    // });

    // newPost.upload = upload._id;
    // upload.Upload = newPost._id;

    // await upload.save();
    // await newPost.save();

    res.status(200).json({
        status: "success",
        message: "successfully declined",
    });
};

// exports.LikePost = async(req, res)=>{
//    try{
//       let result = await Upload.findByIdAndUpdate(req.body._id,{$push: {likes: req.body.userId}},{new: true})
//       res.json(result)
//     }catch(err){
//        return res.status(400).json({
//          error: errorHandler.getErrorMessage(err)
//        })
//    }
// }
//  exports.UnlikePost =  async (req, res) => {
//    try{
//      let result = await Post.findByIdAndUpdate(req.body._id, {$pull: {likes: req.body.userId}}, {new: true})
//      res.json(result)
//    }catch(err){
//      return res.status(400).json({
//        error: errorHandler.getErrorMessage(err)
//      })
//    }
//}

exports.likePost = async (req, res) => {
    //add isUser middleware
    const student = await Student.findOne({ _id: req.userId });
    const upload_id = req.params["id"];
    const upload = await Upload.findOne({ _id: upload_id });
    if (!upload) {
        return res.json({
            success: false,
            data: {
                message: "Resource not found",
            },
        });
    } else {
        if (student.like1 == null) {
            student.like1 = upload.file;
        } else if (student.like2 == null) {
            student.like2 = upload.file;
        } else if (student.like3 == null) {
            student.like3 = upload.file;
        } else if (student.like4 == null) {
            student.like4 = upload.file;
        } else if (student.like5 == null) {
            student.like5 = upload.file;
        } else {
            var l1 = student.like2;
            student.like2 = student.like1;
            var l2 = student.like3;
            student.like3 = l1;
            l1 = student.like4;
            student.like4 = l2;
            student.like5 = l1;
            student.like1 = upload.file;
        }
        student.save();
        return res.json({
            success: true,
            data: {
                message: "Upload liked",
            },
        });
    }
};
exports.search = async (req, res) => {
    console.log("query ", req.query.key, req.query.val);
    if (!req.query.key || !req.query.val) {
        return res.json({
            success: false,
            data: {
                message: "invalid query / filter",
            },
        });
    }
    console.log("after");
    if (req.query.key == "department") {
        //const history = await Upload.find({state:"decliend",state: "post"});
        const upload = await Upload.find({ department: req.query.val });
        console.log(upload.length);
        if (upload.length > 0) {
            return res.json({
                success: true,
                data: {
                    upload,
                },
            });
        } else {
            return res.json({
                success: false,
                data: {
                    message: "Upload not found",
                },
            });
        }
    } else if (req.query.key == "institute") {
        console.log("inside institute");
        try {
            const admins = await Admin.find({
                $text: { $search: req.query.val },
            });
            console.log(admins);
            for (var i = 0; i < admins.length; i++) {
                // TODO: change array to single admin
                console.log(admins[i]);
                if (admins[i].name == req.query.val) {
                    console.log("id: ", admins[i]._id);
                    const uploads = await Upload.find({
                        institute: admins[i]._id,
                    });
                    console.log(uploads);
                    return res.json({
                        success: true,
                        data: {
                            uploads,
                        },
                    });
                }
            }
            return res.json({
                success: false,
                data: {
                    message: "Upload not found",
                },
            });
        } catch (error) {
            console.log(error);
            return res.json({
                success: false,
                data: {
                    message: "server error",
                },
            });
        }
    } else if (req.query.key == "name") {
        try {
            let results = [];
            const student = await Student.findOne({ name: req.query.val });
            console.log("student: ", student.uploads);
            for (var i = 0; i < student.uploads.length; i++) {
                results.push(await Upload.findOne({ _id: student.uploads[i] }));
            }
            //const uploads = await Upload.find({uploader:student._id})
            console.log(results);
            return res.json({
                success: true,
                data: {
                    results,
                },
            });
        } catch (error) {
            console.log(error);
            return res.json({
                success: false,
                data: {
                    message: "server error",
                },
            });
        }
    } else {
        return res.json({
            success: false,
            data: {
                message: "invalid query / filter",
            },
        });
    }
};

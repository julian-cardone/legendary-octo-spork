const express = require("express");
const router = express.Router();
const passport = require("passport");
const keys = require("../../config/keys");

//cover letter model
const CoverLetter = require("../../models/CoverLetter");
//cover letter validtor
const validateCoverLetterInput = require("../../validation/coverletter");
//generate id method
const generateId = require("../../../frontend/src/utils/generateId");

//aws
// const {
//   S3Client,
//   PutObjectCommand,
//   GetObjectCommand,
// } = require("@aws-sdk/client-s3");

// const s3Config = {
//   region: "us-east-1",
//   credentials: {
//     accessKeyId: keys.awss3,
//     secretAccessKey: keys.awss3s,
//   },
// };

// const s3Client = new S3Client(s3Config);

// cl get all from user route
router.get("/uploaded/:userId", (req, res) => {
  //find all CLs with a userId
  CoverLetter.find({ userId: req.params.userId })
    .then((coverletters) => res.send(coverletters))
    .catch((err) =>
      res
        .status(404)
        .json({ nocoverlettersfound: "No cover letters found from that user" })
    );
});

//get coverletter with certain id
router.get("/:coverLetterId", async (req, res) => {
  //find the cover letter in the db
  const coverLetter = await CoverLetter.findOne({
    _id: req.params.coverLetterId,
  });

  //aws
  // if (coverLetter) {
  //   // fetch the encoding from the bucket
  //   const { Body } = await s3Client.send(
  //     new GetObjectCommand({ Bucket: keys.bucketname, Key: coverLetter.title })
  //   );

  //   const bodyContents = await streamToString(Body);

  //   res.send({ uri: bodyContents });
  // }

  //aws: method to parse the string from the bucket
  // const streamToString = (stream) =>
  //   new Promise((resolve, reject) => {
  //     const chunks = [];
  //     stream.on("data", (chunk) => chunks.push(chunk));
  //     stream.on("error", reject);
  //     stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  //   });
});

//cover letter upload route
router.post(
  "/upload",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateCoverLetterInput(req.body); //TODO: CHECK TO SEE IF CORRECT FILE TYPE, STORE DIFFERENTLY BASED ON DIFFERENT FILE TYPES

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const file = req.body.file;
    const id = req.body.userId;
    const name = req.body.name;
    let fileName = generateId();
    
    // console.log(file, id, name);
    
    //check to see if name already exists, if so, produce a new one
    const cl = await CoverLetter.findOne({
      $or: [{ title: fileName }],
    });
    
    while (cl) {
      fileName = generateId();
    }
    
    //upload to aws s3
    // const bucketParams = {
    //   Bucket: keys.bucketname,
    //   Key: fileName,
    //   Body: file,
    // };

    try {
      // const data = await s3Client.send(new PutObjectCommand(bucketParams));
      // fileURL: `https://clgptfiles.s3.amazonaws.com/${fileName}`,
      // ^^ this goes in the new cover letter, a key in the mongo document

      const newCoverletter = new CoverLetter({
        userId: id,
        title: fileName,
        name: name,
        file: file
      });

      newCoverletter.save().then((coverletter) => res.json(coverletter));
    } catch (err) {
      console.log("Error uploading", err);
    }
  }
);

//resume delete route
// router.delete(
//   "/:id",
//   //check to see if correct file type: do this in validations?

//   passport.authenticate("jwt", { session: false }), //test with jwt auth
//   (req, res) => {
//     Resume.findOneAndDelete(req.params.id)
//       .then((resume) => res.json({ msg: "deleted successfully" }))
//       .catch((err) =>
//         res.status(404).json({ noresumefound: "Unable to delete" })
//       );
//   }
// );

//edit resume
// router.put(
//   "/:id",

//   passport.authenticate("jwt", { session: false }), //test with jwt auth
//   (req, res) => {
//     //validate
//     const { errors, isValid } = validateResumeInput(req.body);

//     if (!isValid) {
//       return res.status(400).json(errors);
//     }

//     //find and update
//     Resume.findByIdAndUpdate(req.params.id, req.body)
//       .then((resume) => res.json({ msg: "updated successfully" }))
//       .catch((err) =>
//         res.status(404).json({ noresumefound: "Unable to update" })
//       );
//   }
// );

module.exports = router;

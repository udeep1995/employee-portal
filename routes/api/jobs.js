const express = require("express");
const router = express.Router();
const passport = require("passport");
const Job = require("../../models/Job");
const {MANAGER} = require("../../constants/common-constants");
const {isEmpty} = require("../../validation/isEmpty");

// get all openings
router.get("/openings",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Job.find({}, '_id projectname role status jobdescription').then(jobs => {
            jobs = jobs.filter(job => !!job.status);
            res.render('jobs', {jobs});
        }).catch(err => {
            res.status(500).json(err);
        })
    });

// get specific opening
router.get("/openings/:uid",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        Job.findById(req.params.uid).then(job => {
            if (job) {
                job.technologies = job.technologies.join();
                res.render('job', {job});
            } else {
                res.status(404).json(`No such job/position found`);
            }
        }).catch(err => {
            res.status(404).json(err);
        });
    });


// add position
router.post("/add-position",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
    const position = {};
    position.user = req.user;

    if(MANAGER !== position.user.role) {
        res.status(401).json(`Invalid permissions. Operation denied`);
        return;
    }

    if(req.body.projectname) position.projectname = req.body.projectname;
    if(req.body.clientname) position.clientname = req.body.clientname;
    if(req.body.technologies) position.technologies = req.body.technologies.split(",");
    if(req.body.role) position.role = req.body.role;
    if(req.body.jobdescription) position.jobdescription = req.body.jobdescription;
    if(req.body.status) position.status = req.body.status;
    position.createdby = position.user.id;
    
    new Job(position).save().then((result)=> {
         res.status(200).json({message: `Job position added successfully`});
    });
})


// edit position
router.post("/edit-position/:uid",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
    const position = {};
    const uid = req.params.uid;

    if(isEmpty(uid)) {
        return res.status(400).json(
            {
                message: `Parameters sent are empty`
            }
        )
    }

    position.user = req.user;
    
    if(MANAGER !== position.user.role) {
        res.status(401).json(`Invalid permissions. Operation denied`);
        return;
    }

    if(req.body.projectname) position.projectname = req.body.projectname;
    if(req.body.clientname) position.clientname = req.body.clientname;
    if(req.body.technologies) position.technologies = req.body.technologies;
    if(req.body.role) position.role = req.body.role;
    if(req.body.jobdescription) position.jobdescription = req.body.jobdescription;
    if(req.body.status) position.status = req.body.status;
    position.createdby = position.user.id;
    
    Job.findOne({ _id: uid }).then(job => {
        if (job) {
          Job.findOneAndUpdate(
            { _id: uid },
            { $set: position },
            { new: true }
          ).then(result => res.status(200).json({message: `Job position updated successfully`}));
        } else {
            res.status(404).json(`Cant find position with id  = ${uid}`);
        }
    });
});

module.exports = router;
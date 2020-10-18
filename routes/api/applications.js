const express = require("express");
const router = express.Router();
const passport = require("passport");
const Job = require("../../models/Job");
const Application = require("../../models/Application");
const { EMPLOYEE } = require("../../constants/common-constants");
const {isEmpty} = require("../../validation/isEmpty");

// apply for opening
router.get("/openings/:uid",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        const { uid } = req.params;
        if(isEmpty(uid)) {
            return res.status(400).json(
                {
                    message: `Parameters sent are empty`
                }
            )
        }

        Job.findById(uid).then(position => {
            if (position) {
                if (EMPLOYEE !== req.user.role) {
                    return res.status(401).json(`Invalid user permissions. Permission denied. Only employees can apply for this position/opening`);
                }
                if(!position.status) {
                    return res.status(200).json(`This job position is closed.`);
                }
                Application.findOne({ job: uid }).then(application => {
                    if (application) {
                        let currUsers = application.users;
                        const isAlreadyApplied = currUsers.filter(u => u == req.user._id.toString() ? true : false);
                        if (isAlreadyApplied.length > 0) {
                            return res.status(200).json(
                                {
                                    message: `You have already applied for this position.`
                                }
                            )
                        }
                        application.users.unshift(req.user._id);
                        Application.findOneAndUpdate(
                            { _id: application._id },
                            { $set: application },
                            { new: true }
                        ).then(applicationSaved => res.status(200).json({
                            message: `Successfully applied for position`
                        }));
                    }
                    else {
                        const application = {};
                        application.job = uid;
                        application.users = [req.user._id];
                        new Application(application).save().then(applicationSaved => res.status(200).json({
                            message: `Successfully applied for position`
                        })).catch(err => res.status(500).json(err));
                    }
                }).catch(err => console.log(err));
            } else {
                res.status(404).json(`No such job/position found`);
            }
        });
});



module.exports = router;
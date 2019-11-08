const express = require('express');
const router = express.Router();
const databaseMethods = require("../methods/database");

router.get('/', (request, response, next) => {
    response.redirect("/register");
});
router.get("/register", function (req, res) {
    res.render('login', {
        pageTitle: 'Java Exam Cram || Login',
    });
});
router.post("/register", function (req, res) {
    const studentID = req.body.studentID;
    const password=req.body.password;
    if (studentID.trim().length !== 9) {
        req.flash("error", "Please enter a valid student ID");
        res.redirect("/register");
    } else {
        databaseMethods.findActiveExamCram().then((result) => {
            if(result==null)
                res.send("NO EXAM CRAM OPENED YET ! Please visit back later");
            else {
                if(String(result.password)!==password){
                    req.flash("error","Incorrect exam cram password");
                    res.redirect("/register");
                }
                else {
                    const result = databaseMethods.insertStudent(req.body.firstName, req.body.lastName, req.body.studentID, req.body.campus);
                    if (result)
                        console.log("STUDENT REGISTERED SUCCESSFULLY !");
                    else
                        console.error("PROBLEM IN INSERTING STUDENT !");
                    req.session.isRegistered = true;
                    res.redirect("/startExamCram");
                }
            }
        }).catch(()=>{
            console.log("Error in retrieving active exam cram");
        });
    }
});

exports.routes = router;
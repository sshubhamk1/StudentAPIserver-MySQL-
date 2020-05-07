const express = require('express');
const router = express.Router();
const path = require('path')
const dotenv = require('dotenv');
//const Student = require('../models/student');
const mysql = require('mysql')
dotenv.config({ path: './config.env' });
const Student = mysql.createConnection({
    connectionLimit: 10,
    host: process.env.dbHost,
    user: process.env.dbUser,
    password: process.env.dbPassword,
    database: process.env.db,
    port: process.env.dbPort
});
Student.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

//get routes starts here
router.get('/', (req, res) => {
    Student.query("SELECT name, class, roll_num, reg_num, mob_num, address from student", (error, students) => {
        if (error) {
            req.flash('error_msg', 'ERROR: ' + error);
            res.redirect('/');
        }
        res.render('index', { students: students });
        // conn.release();
    });
    /*Student.find({})
        .then(students => {
            res.render('index', {students : students});
        })
        .catch(err=> {
            req.flash('error_msg', 'ERROR: '+err)
            res.redirect('/');
        })
        */

});

router.get('/student/new', (req, res) => {
    res.render('new');
});

router.get('/student/search', (req, res) => {
    res.render('search', { students: "" });
});

router.get('/student', (req, res) => {
    let searchQuery = req.query.name;
    Student.query("SELECT * from  student WHERE name = ?", req.query.name, (error, students) => {
        if (error) {
            res.flash('error_msg', 'ERROR: ' + error);
            res.redirect('/');
        }
        else {
            console.log(students);
            res.render('search', { students: students });
        }
    });
    /*
    Student.findOne(searchQuery)
        .then(student => {
            res.render('search', {student:student});
        })
        .catch(err => {
            req.flash('error_msg', 'ERROR: '+err)
            res.redirect('/');
        });
        */
});

router.get('/edit/:id', (req, res) => {

    //let searchQuery = { reg_num: req.params.id };
    Student.query("SELECT * from student where reg_num = ?", req.params.id, (error, student) => {
        if (error) {
            req.flash('error_msg', "ERROR: " + error);
            console.log("Something went wrong");
            res.redirect('/');
        }
        else {
            if (student) console.log("empty student")
            console.log(student);
            res.render('edit', { student: student[0] });
        }
    })
    /*
    Student.findOne(searchQuery)
        .then(student => {
            res.render('edit', {student:student});
        })
        .catch(err => {
            req.flash('error_msg', 'ERROR: '+err)
            res.redirect('/');
        });
        */

});

//get routes ends here


//post routes starts here
router.post('/student/new', (req, res) => {
    let newStudent = {
        name: req.body.name,
        class: req.body.class,
        roll_num: req.body.roll_num,
        reg_num: req.body.reg_num,
        mob_num: req.body.mob_num,
        address: req.body.address
    };
    Student.query("Insert into student set ?", newStudent, (err, success) => {
        if (err) {
            console.log('error occcured', err);
            req.flash('error_msg', `ERROR: ${err}`);
            res.redirect('/');
        }
        if (success) {
            req.flash('success_msg', 'Student data added to database successfully.');
            res.redirect('/');
        }
    });

    /*Student.create(newStudent)
        .then(student => {
            req.flash('success_msg', 'Student data added to database successfully.')
            res.redirect('/');
        })
        .catch(err => {
            req.flash('error_msg', 'ERROR: '+err)
            res.redirect('/');
        });
        */
});

//post routes end here

//put routes starts here

router.put('/edit/:id', (req, res) => {
    let reg_num = req.params.id;
    let sql = "UPDATE student set name=?, class=?,roll_num = ?, reg_num=?,mob_num=?, address=? where reg_num = ?";
    Student.query(sql, [req.body.name, req.body.class, req.body.roll_num, req.body.reg_num, req.body.mob_num, req.body.address, reg_num], (error, student) => {
        if (student) {
            req.flash('success_msg', 'Student data updated successfully.');
            res.redirect('/');
        }
        if (error) {
            req.flash('error_msg', 'ERROR: ' + error);
            res.redirect('/');
        }
    })
    /*
        Student.updateOne(searchQuery, {$set: {
            name : req.body.name,
            class : req.body.class,
            roll_num : req.body.roll_num,
            reg_num: req.body.reg_num,
            mob_num: req.body.mob_num,
            address: req.body.address
        }})
        .then(student => {
            req.flash('success_msg', 'Student data updated successfully.')
            res.redirect('/');
        })
        .catch(err => {
            req.flash('error_msg', 'ERROR: '+err)
            res.redirect('/');
        });*/
});

//put routes ends here


//delete routes starts here
router.delete('/delete/:id', (req, res) => {
    Student.query("delete from student where reg_num = ?", req.params.id, (error, student) => {
        if (error) {
            req.flash('error_msg', 'ERROR: ' + error);
            res.redirect('/');
        }
        else {
            req.flash('success_msg', 'Student deleted Successfully.')
            res.redirect('/');
        }
    })
    /*
    Student.deleteOne(searchQuery)
        .then(student=>{
            req.flash('success_msg', 'Student deleted successfully.')
            res.redirect('/');
        })
        .catch(err => {
            req.flash('error_msg', 'ERROR: '+err)
            res.redirect('/');
        });*/
});

//delete routes ends here
module.exports = router;
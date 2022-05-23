let mysql = require("mysql2")
const db = require('../models/index'); 
const Trainers = db.sequelize.models.Trainers;
const trainers = require("../models/trainers");
var express = require('express');
var router = express.Router();


// list
router.get('/', async function (req, res) {
    let trainers = await Trainers.findAll({ attributes: ['id', 'firstName', 'lastName', 'subject'] });
    console.log(trainers);
    res.render('trainers/list',
        {
            title: 'Express 002 - Trainers page',
            list: trainers
        });
});

// GET create
router.get('/create', (req, res) => {
    res.render('trainers/create-update', {
        title: 'Express 002 - New Trainer page',
        message: 'New Trainer',
        action: 'create',
        trainer: {}
    });
});

// POST create
router.post('/create', async (req, res) => {
    await Trainers.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        subject: req.body.subject
    });
    res.redirect('/trainers');
});

//delete

router.get('/delete', async function (req, res) {
    await Trainers.destroy({ where: { id: req.query.id } }).then((deleted) => {
        if (deleted === 1) {
            res.render('trainers/deleted',
                {
                    title: 'Express 002 - Trainers delete page',
                    message: `You deleted trainer with id: ${req.query.id}`
                });
        }
    },
        (error) => {
            res.render('trainers/deleted',
                {
                    title: 'Express 002 - Trainers delete page',
                    message: `<div><p>There was an error deleting trainer with id: ${req.query.id}</p>
                           <p>Error: ${error}</p></div>`
                });
        });

});
// GET update
router.get('/edit/:id', async (req, res) => {
    let trainer = await Trainers.findByPk(req.params.id, { attributes: ['id', 'firstName', 'lastName', 'subject'] });
    console.log(trainer);
    res.render('trainers/create-update', {
        title: 'Express 002 - Edid Trainer page',
        message: 'Edit a Trainer',
        action: 'update',
        trainer: trainer
    });
});

// POST update
router.post('/update', async (req, res) => {
    let trainer = await Trainers.findByPk(req.body.id, { attributes: ['id', 'firstName', 'lastName', 'subject'] });
    if (trainer.id == req.body.id) {
        trainer.firstName = req.body.firstName;
        trainer.lastName = req.body.lastName;
        trainer.subject = req.body.subject;
        await trainer.save();
    }

    res.redirect('/trainers');
});

module.exports = router;
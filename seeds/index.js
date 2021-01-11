const fs = require('fs');
const mongoose = require('mongoose');
const Papa = require('papaparse');
const path = require('path');

const School = require('../models/school');

const sep_schools_path = path.join(__dirname, 'sep_schools.csv');
const schools_rank_path = path.join(__dirname, 'schools_rank.csv');
const schools_description_path = path.join(__dirname, 'schools_description.csv');


var url = process.env.DB_URL || "mongodb://localhost:27017/NUSExchange";
mongoose.connect(url , {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sep_schools_file = fs.createReadStream(sep_schools_path);
let sep_schools = [];

const schools_rank_file = fs.createReadStream(schools_rank_path);
let schools_rank = [];

const schools_description_file = fs.createReadStream(schools_description_path);
let schools_description = [];

Papa.parse(sep_schools_file, {
    header:true,
    worker: true,
    complete: response1 => {
    sep_schools = response1.data;

     Papa.parse(schools_rank_file, {
            header:true,
            worker: true,
            complete: response2 => {
                schools_rank = response2.data;
                schools_rank = schools_rank.filter(school =>
                    sep_schools.some(sep_school => {
                       return sep_school['Partner University'] === school.name;
                        }));


            Papa.parse(schools_description_file, {
                header:true,
                worker: true,
                complete: response3 => {
                    schools_description = response3.data;
                    schools_rank.forEach(school => {
                        let school_desc = schools_description.find(schools_description =>
                                                                     schools_description.Name === school.name);
                        if(school_desc != null)
                        school.description = school_desc.Description;

                    })
                seedDB();
                });
            }
            });

     }
     });


}});


const seedDB = async() => {

   await School.deleteMany({});


   await schools_rank.forEach(async (school_rank) => {
   const school =  new School({
    institution: school_rank.name,
    description: school_rank.description,
    location: school_rank.location,
    world_rank: school_rank['﻿rank'],
    national_rank: school_rank.national_rank
    })
    await school.save();

   });



   sep_schools.forEach((sep_school) => {

   let name = sep_school['Partner University'];
   let sem_1 = sep_school.SEM_1.replace(/\D/g, "");
   let sem_2 = sep_school.SEM_2.replace(/\D/g, "");
   let any_sem = sep_school.ANY_SEM.replace(/\D/g, "");

    School.findOne({"institution": name}).exec((err, result) => {
   if(err){
   console.log('ERROR WHEN FINDING MATCHING SEP SCHOOL DATABASE: ' + err);
   }

   if(result){

    School.findByIdAndUpdate(
   result._id,
   { "$set" :    {"sem_1": sem_1, "sem_2": sem_2, "any_sem": any_sem}}
   );
   } else {
   const school = new School({
   institution: name,
   sem_1: sem_1,
   sem_2: sem_2,
   any_sem: any_sem,
   });

    school.save();

   }
   });

   });
}


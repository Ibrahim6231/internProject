const { findOne } = require('../models/collegeModel.js');
const collegeModel = require('../models/collegeModel.js');
const internModel = require('../models/internModel.js');

//create college
const createCollege = async function(req, res){
    try {
        const details = req.body;
        const savedCollege = await collegeModel.create(details);
        return res.status(201).send({status:true, data:savedCollege});
    } catch (error) {
        console.log(error)
        return res.status(500).send({status:false, messsage: error.message})
    }
}


//get college details
const collegeInterns = async function(req, res){
    try {
        const collegeAbbreviation = req.query.collegeName;
        if(!collegeAbbreviation) return res.status(400).send({status:false, message: "enter the abbreviated name of a college"}); //validation1
    
        let college = await collegeModel.findOne({name: collegeAbbreviation}).select({name:1, fullName:1, logoLink:1});
        if(!college) return res.status(404).send({status:false, message:"no college found"});   //validation2
        
        const clgId = college._id       //here conversion into  string is optional,
        const internsList = await internModel.find({collegeId : clgId}).select({name:1, email:1, mobile:1});
        const result =  {...college.toJSON(), interns : internsList};
        delete result._id;

        return res.status(200).send({status:true, data: result});

    } catch (error) {
        console.log(error);
        return res.status(500).send({status:false, message: error.message})
    }
}

module.exports.collegeInterns = collegeInterns;
module.exports.createCollege = createCollege;
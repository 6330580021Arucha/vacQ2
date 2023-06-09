const Hospital = require('../models/Hospital')
const vacCenter = require('../models/VacCenter')

//@desc     Get vaccine centers
//@route    GET /api/v1/hospitals/vacCenters/
//access    Public
exports.getVacCenters = (req, res, next) => {
    vacCenter.getAll((err, data) => {
        if(err) {
            res.status(500).send({
                message: err.message || "Some erre occurred while retrieving vaccine Centers."
            });
        } else {
            res.send(data);
        }
    });
};

//Get all
// exports.getHospitals = (req, res, next) => {
//     res.status(200).json({success:true, msg:'Show all hospitals'});
// };

//Real get all hospital
exports.getHospitals = async (req, res, next) => {
    let query;

    //Copy req.query
    const reqQuery = {...req.query};

    //fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    //Loop over remove fields and delete them from reqQuery
    removeFields.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);
    let queryStr = JSON.stringify(req.query);

    //create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match=>`$${match}`);

    //finding resource
    query = Hospital.find(JSON.parse(queryStr)).populate('appointments');

    //Select fields
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    //Sort
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }else{
        query = query.sort('-createAt');
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page-1)*limit;
    const endIndex = page*limit;
    const total = await Hospital.countDocuments();

    query = query.skip(startIndex).limit(limit);

    try{
        //Excution query
        const hospitals = await query;

        //Pagination result
        const pagination = {};

        if(endIndex < total){
            pagination.next={
                page: page+1,
                limit
            }
        }
        if(startIndex > 0){
            pagination.prev={
                page:page-1,
                limit
            }
        }
        res.status(200).json({
            success: true, 
            count: hospitals.length, 
            pagination,
            data: hospitals
        });
    }catch(err){
        res.status(400).json({success: false});
    }
};

//Get one hospital with id
// exports.getHospital = (req, res, next) => {
//     res.status(200).json({success:true, msg:`Show hospitals ${req.params.id}`});
// };

//Real get one hospital
exports.getHospital = async (req, res, next) => {
    try{
        const hospital = await Hospital.findById(req.params.id);

        if(!hospital){
            return res.status(400).json({success: false});
        }
        res.status(200).json({success: true, data: hospital});
    }catch(err){
        res.status(400).json({success: false});
    }
};

//Create new 
// exports.createHospital = (req, res, next) => {
//     console.log(req.body);
//     res.status(200).json({success:true, msg:'Create new hospitals'});
// };

//Real create hospital in database
exports.createHospital = async (req, res, next) => {
    const hospital =  await Hospital.create(req.body);
    res.status(201).json({success: true, data: hospital});
};

//Update
// exports.updateHospital = (req, res, next) => {
//     res.status(200).json({success:true, msg:`Update hospital ${req.params.id}`});
// };

//Real Update to database
exports.updateHospital = async (req, res, next) => {
    try{
        const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if(!hospital){
            return res.status(400).json({success: falase});
        }
        res.status(200).json({success: true, data: hospital});
    }catch(err){
        res.status(400).json({success: false});
    }
};

//Delete
// exports.deleteHospital = (req, res, next) => {
//     res.status(200).json({success:true, msg:`Delete hospital ${req.params.id}`});
// };

//Real Delete from database
exports.deleteHospital = async (req, res, next) => {
    try{
        const hospital = await Hospital.findById(req.params.id);

        if(!hospital){
            return res.status(400).json({success: false, message: `Bootcamp not found with id of ${req.params.id}`});
        }

        hospital.remove();
        res.status(200).json({success: true, data: {}});
    }catch(err){
        res.status(400).json({success: false});
    }
};





const Appointment = require('../models/Appointment');
const Hospital = require('../models/Hospital');

//@desc     Get all appointment
//@route    Get /api/v1/appointment
//@access   Public
exports.getAppointments = async (req, res, next) => {
    let query;
    //General  users can see only their appointments!
    if(req.user.role !== 'admin'){
        query = Appointment.find({user: req.user.id}).populate({
            path: 'hospital',
            select: 'name province tel'
        });
    }else{
        //If you are an admin, you can see all appointments!
        query = Appointment.find().populate({
            path: 'hospital',
            select: 'name province tel'
        });
    }
    try{
        const appointments = await query;
        res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Cannot find Appointment"
        });
    }
};

//@desc     Get single appointment
//@route    GET /api/v1/appoints/:id
//@access   Public
exports.getAppointment = async (req, res, next)=>{
    if(req.user.role !== 'admin'){
        query = Appointment.find({user: req.user.id}).populate({
            path: 'hospital',
            select: 'name province tel'
        });
    }else{
        //If you are an admin, you can see all appointments!
        query = Appointment.find().populate({
            path: 'hospital',
            select: 'name province tel'
        });
    }
    try{
        const appointment = await query.populate({
            path: 'hospital',
            select: 'name description tel'
        });

        if(!appointment){
            return res.status(404).json({
                success: false,
                message: `No appoint with the id of ${req.params.id}`
            });
        }

        res.status(200).json({
            success: true,
            data: appointment
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false, 
            message: "Cannot finc appoint"
        });
    }
};

//@desc     Add appointmnet
//@route    POST /api/v1/hospitals/:hospita;Id/appointmnet
//@access   Private
exports.addAppointment = async (req, res, next)=>{
    try{
        req.body.hospital = req.params.hospitalId;

        const hospital = await Hospital.findById(req.params.hospitalId);

        if(!hospital){
            return res.status(404).json({
                success: false,
                message: `No hospital with the id of ${req.params.hospitalId}`
            });
        }

        // add user ID to req.body
        req.body.user = req.user.id;

        // check for existedappointment
        const existedappointments = await Appointment.find({user:req.user.id});

        // if the user is not an admin, they can only create 3 appointment.
        if(existedappointments.length >= 3 && req.user.role !== 'admin'){
            return res.status(400).json({
                success: false,
                message: `The user with ID ${req.user.id} has already made 3 appointment`
            });
        }

        const appointment = await Appointment.create(req.body);

        res.status(200).json({
            success: true,
            data: appointment
        });
    }catch(error){
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Cannot create Appointment"
        });
    }
}

//@desc     Update appointment
//@route    PUT /api/appointment/:id
//@access   Private
exports.updateAppointment = async(req, res, next) => {
    try{
        let appointment = await Appointment.findById(req.params.id);

        if(!appointment){
            return res.status(404).json({
                success: false,
                message: `No appointment with the id of ${req.params.id}`
            });
        }

        if(appointment.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to update this bootcamp`
            });
        }

        appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValidators: true
        });
        res.status(200).json({
            success: true,
            data: appointment
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Canonot update appointment"
        });
    }
}

//@desc     Delete appointment
//@route    DELETE /api/v1/appointment/:id
//@access   Private
exports.deleteAppointment = async(req, res, next) => {
    try{
        const appointment = await Appointment.findById(req.params.id);

        if(!appointment){
            return res.status(200).json({
                success: false,
                message: `No appointment with the id of ${req.params.id}`
            });
        }

        if(appointment.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(401).json({
                success: false,
                message: `User ${req.user.id} is not authorized to delete this bootcamp`
            });
        }

        await appointment.remove();

        res.status(200).json({
            success: true,
            data: {}
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot delete appointment"
        });
    }
}
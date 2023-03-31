const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Plase add a name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more tahen 50 characters']
    },
    address: {
        type: String,
        required: [true, 'Plase add an address']
    },
    district: {
        type: String,
        required: [true, 'Plase add a district']
    },
    province: {
        type: String,
        required: [true, 'Plase add a province']
    },
    postalcode: {
        type: String,
        required: [true, 'Plase add a postalcode'],
        maxlength: [5, 'Postal Code can not be more than 5 digits']
    },
    tel: {
        type: String
    },
    region: {
        type: String,
        required: [true, 'Plase add a region']
    }
},{
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});

//Cascade delete appointment when a hospital is deleted
HospitalSchema.pre('remove', async function(next){
    console.log(`Appointments being removed from hospital ${this._id}`);
    await this.model('Appointment').deleteMany({hospital: this._id});
    next();
});

//Reverse populate with virtuals
HospitalSchema.virtual('appointments',{
    ref: 'Appointment',
    localField: '_id',
    foreignField: 'hospital',
    justOne: false
});

module.exports = mongoose.model('Hospital', HospitalSchema);
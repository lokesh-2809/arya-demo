const mongoose = require('mongoose');

// to do: update required based on mandatory fields
const shipmentSchema = new mongoose.Schema({
    shipmentName: { type: String, required: true},
    shipmentBookingNumber: String,
    confirmationNumber: String,
    vesselName: String,
    bookingConfirmationDocument: Buffer,
    pointOfLoading: String,
    pointOfDestination: String,
    modeOfBooking: { type: String, enum: ['DIRECT BOOKING', 'FREIGHT FORWARDER']},
    containerType: String,
    noOfContainers: Number,
    shippingLine: String,
    rate: mongoose.Types.Decimal128,
    containerAllocated: Number,
    conatinerBalance: Number,
    containerSize: String,
    totalShipmentCost: mongoose.Types.Decimal128,
    vesselDepartDate: Date,
    etaDate: Date,
    vesselCutOffDate: Date,
    containersAvailability: {type: String, enum: ['YES', 'NO']},
    status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE'},
    calculateTotalShipmentCost: String
}, { timestamps: true });

const Shipment = mongoose.model('Shipment', shipmentSchema);
module.exports = Shipment;


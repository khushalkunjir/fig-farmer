import {Schema, model, models} from 'mongoose';

const VendorSchema = new Schema(
  {
    name: {type: String, required: true},
    phone: {type: String},
    location: {type: String},
    notes: {type: String}
  },
  {timestamps: {createdAt: true, updatedAt: false}}
);

const Vendor = models.Vendor || model('Vendor', VendorSchema);

export default Vendor;

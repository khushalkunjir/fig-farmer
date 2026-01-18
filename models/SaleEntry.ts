import {Schema, model, models, Types} from 'mongoose';

const LineItemSchema = new Schema(
  {
    boxTypeId: {type: Types.ObjectId, ref: 'BoxType', required: true},
    qtyPerBox: {type: Number, required: true},
    boxCount: {type: Number, required: true}
  },
  {_id: false}
);

const SaleEntrySchema = new Schema(
  {
    date: {type: Date, required: true},
    vendorId: {type: Types.ObjectId, ref: 'Vendor', required: true},
    items: {type: [LineItemSchema], required: true},
    expectedAmount: {type: Number},
    finalAmount: {type: Number},
    status: {type: String, enum: ['PENDING', 'CONFIRMED'], default: 'PENDING'},
    confirmationDate: {type: Date},
    notes: {type: String}
  },
  {timestamps: {createdAt: true, updatedAt: false}}
);

const SaleEntry = models.SaleEntry || model('SaleEntry', SaleEntrySchema);

export default SaleEntry;

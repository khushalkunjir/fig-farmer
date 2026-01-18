import {Schema, model, models, Types} from 'mongoose';

const LineItemSchema = new Schema(
  {
    boxTypeId: {type: Types.ObjectId, ref: 'BoxType', required: true},
    qtyPerBox: {type: Number, required: true},
    boxCount: {type: Number, required: true}
  },
  {_id: false}
);

const HarvestEntrySchema = new Schema(
  {
    date: {type: Date, required: true},
    notes: {type: String},
    items: {type: [LineItemSchema], required: true}
  },
  {timestamps: {createdAt: true, updatedAt: false}}
);

const HarvestEntry = models.HarvestEntry || model('HarvestEntry', HarvestEntrySchema);

export default HarvestEntry;

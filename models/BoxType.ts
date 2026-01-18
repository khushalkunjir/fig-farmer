import {Schema, model, models} from 'mongoose';

const BoxTypeSchema = new Schema(
  {
    name: {type: String, required: true},
    defaultQtyPerBox: {type: Number}
  },
  {timestamps: {createdAt: true, updatedAt: false}}
);

const BoxType = models.BoxType || model('BoxType', BoxTypeSchema);

export default BoxType;

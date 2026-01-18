import {Schema, model, models} from 'mongoose';

const AdminUserSchema = new Schema(
  {
    username: {type: String, unique: true, sparse: true},
    email: {type: String, unique: true, sparse: true},
    passwordHash: {type: String, required: true}
  },
  {timestamps: {createdAt: true, updatedAt: false}}
);

const AdminUser = models.AdminUser || model('AdminUser', AdminUserSchema);

export default AdminUser;

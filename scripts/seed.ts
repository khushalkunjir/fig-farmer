import {config} from 'dotenv';
import {connectToDatabase} from '../lib/db';
import AdminUser from '../models/AdminUser';
import Vendor from '../models/Vendor';
import BoxType from '../models/BoxType';
import HarvestEntry from '../models/HarvestEntry';
import SaleEntry from '../models/SaleEntry';
import {hashPassword} from '../lib/auth';

config();

async function seed() {
  await connectToDatabase();

  const adminCount = await AdminUser.countDocuments();
  if (adminCount === 0) {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const passwordHash = await hashPassword(password);
    await AdminUser.create({username, passwordHash});
    console.log(`Created admin: ${username}`);
  }

  let vendors = await Vendor.find();
  if (vendors.length === 0) {
    vendors = await Vendor.create([
      {name: 'Green Basket', phone: '9876543210', location: 'Pune'},
      {name: 'Sunrise Traders', phone: '9123456780', location: 'Mumbai'}
    ]);
    console.log('Seeded vendors');
  }

  let boxTypes = await BoxType.find();
  if (boxTypes.length === 0) {
    boxTypes = await BoxType.create([
      {name: 'Small Box', defaultQtyPerBox: 20},
      {name: 'Medium Box', defaultQtyPerBox: 35},
      {name: 'Large Box', defaultQtyPerBox: 50}
    ]);
    console.log('Seeded box types');
  } else if (!boxTypes.some((box) => box.name.toLowerCase() === 'medium box')) {
    const medium = await BoxType.create({name: 'Medium Box', defaultQtyPerBox: 35});
    boxTypes = [...boxTypes, medium];
    console.log('Added Medium Box');
  }

  const harvestCount = await HarvestEntry.countDocuments();
  if (harvestCount === 0) {
    await HarvestEntry.create([
      {
        date: new Date(),
        notes: 'Morning harvest',
        items: [
          {boxTypeId: boxTypes[0]._id, qtyPerBox: 20, boxCount: 5},
          {boxTypeId: boxTypes[1]._id, qtyPerBox: 50, boxCount: 3}
        ]
      },
      {
        date: new Date(Date.now() - 86400000),
        notes: 'Yesterday harvest',
        items: [{boxTypeId: boxTypes[0]._id, qtyPerBox: 20, boxCount: 8}]
      }
    ]);
    console.log('Seeded harvest entries');
  }

  const salesCount = await SaleEntry.countDocuments();
  if (salesCount === 0) {
    await SaleEntry.create([
      {
        date: new Date(),
        vendorId: vendors[0]._id,
        items: [{boxTypeId: boxTypes[0]._id, qtyPerBox: 20, boxCount: 4}],
        expectedAmount: 2000,
        status: 'PENDING'
      },
      {
        date: new Date(Date.now() - 172800000),
        vendorId: vendors[1]._id,
        items: [{boxTypeId: boxTypes[1]._id, qtyPerBox: 50, boxCount: 2}],
        expectedAmount: 5000,
        finalAmount: 4800,
        status: 'CONFIRMED',
        confirmationDate: new Date(Date.now() - 86400000)
      }
    ]);
    console.log('Seeded sales entries');
  }

  console.log('Seed complete');
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

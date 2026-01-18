import {connectToDatabase} from './db';
import SaleEntry from '@/models/SaleEntry';
import HarvestEntry from '@/models/HarvestEntry';

export async function getDashboardTotals(start: Date, end: Date) {
  await connectToDatabase();

  const [harvestAgg] = await HarvestEntry.aggregate([
    {$match: {date: {$gte: start, $lte: end}}},
    {$unwind: '$items'},
    {$group: {
      _id: null,
      totalBoxes: {$sum: '$items.boxCount'},
      totalQuantity: {$sum: {$multiply: ['$items.qtyPerBox', '$items.boxCount']}}
    }}
  ]);

  const [salesAgg] = await SaleEntry.aggregate([
    {$match: {date: {$gte: start, $lte: end}}},
    {$unwind: '$items'},
    {$group: {
      _id: null,
      totalBoxes: {$sum: '$items.boxCount'},
      totalQuantity: {$sum: {$multiply: ['$items.qtyPerBox', '$items.boxCount']}}
    }}
  ]);

  const pendingCount = await SaleEntry.countDocuments({status: 'PENDING'});

  const monthStart = new Date(start.getFullYear(), start.getMonth(), 1);
  const monthEnd = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59);
  const [monthAgg] = await SaleEntry.aggregate([
    {$match: {status: 'CONFIRMED', confirmationDate: {$gte: monthStart, $lte: monthEnd}}},
    {$group: {_id: null, totalAmount: {$sum: '$finalAmount'}}}
  ]);

  return {
    harvest: harvestAgg || {totalBoxes: 0, totalQuantity: 0},
    sales: salesAgg || {totalBoxes: 0, totalQuantity: 0},
    pendingCount,
    monthConfirmedAmount: monthAgg?.totalAmount || 0
  };
}

export async function getDailyReport(start: Date, end: Date) {
  await connectToDatabase();

  const harvest = await HarvestEntry.aggregate([
    {$match: {date: {$gte: start, $lte: end}}},
    {$unwind: '$items'},
    {$group: {
      _id: '$date',
      totalBoxes: {$sum: '$items.boxCount'},
      totalQuantity: {$sum: {$multiply: ['$items.qtyPerBox', '$items.boxCount']}}
    }},
    {$sort: {_id: 1}}
  ]);

  const sales = await SaleEntry.aggregate([
    {$match: {date: {$gte: start, $lte: end}}},
    {$unwind: '$items'},
    {$group: {
      _id: '$date',
      totalBoxes: {$sum: '$items.boxCount'},
      totalQuantity: {$sum: {$multiply: ['$items.qtyPerBox', '$items.boxCount']}}
    }},
    {$sort: {_id: 1}}
  ]);

  return {harvest, sales};
}

export async function getMonthlySummary(year: number) {
  await connectToDatabase();

  const sales = await SaleEntry.aggregate([
    {$match: {status: 'CONFIRMED', confirmationDate: {$gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31, 23, 59, 59)}}},
    {$group: {
      _id: {$month: '$confirmationDate'},
      totalAmount: {$sum: '$finalAmount'}
    }},
    {$sort: {_id: 1}}
  ]);

  return sales;
}

export async function getVendorTotals(start: Date, end: Date) {
  await connectToDatabase();

  return SaleEntry.aggregate([
    {$match: {status: 'CONFIRMED', confirmationDate: {$gte: start, $lte: end}}},
    {$group: {
      _id: '$vendorId',
      totalAmount: {$sum: '$finalAmount'}
    }}
  ]);
}

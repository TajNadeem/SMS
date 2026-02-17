const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const FeeInvoice = require('./FeeInvoice');
const Student = require('./Student');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  receiptNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  invoiceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'fee_invoices',
      key: 'id'
    }
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  paymentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'card', 'upi', 'bank_transfer', 'cheque', 'online'),
    allowNull: false
  },
  transactionId: {
    type: DataTypes.STRING(100),
    allowNull: true,
    comment: 'Transaction/Reference ID for online payments'
  },
  chequeNumber: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  bankName: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  remarks: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  collectedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'payments',
  timestamps: true
});

module.exports = Payment;
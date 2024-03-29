'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsToMany(models.Product, {
        through: models.OrderItem,
        foreignKey: 'OrderId',
        as: 'items'
      })
      Order.belongsTo(models.User)
      Order.hasMany(models.Payment)
    }
  };
  Order.init({
    sn: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    shipping_status: DataTypes.INTEGER,
    phone: DataTypes.STRING,
    name: DataTypes.STRING,
    payment_status: DataTypes.INTEGER,
    address: DataTypes.STRING,
    UserId: DataTypes.INTEGER,
    shipping_date: DataTypes.DATE,
    email: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};
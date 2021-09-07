'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  };
  CartItem.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quantity: DataTypes.INTEGER,
    ProductId: DataTypes.INTEGER,
    CartId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CartItem',
  });
  return CartItem;
};
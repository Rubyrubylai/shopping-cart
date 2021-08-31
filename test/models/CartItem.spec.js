var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
const proxyquire = require('proxyquire');
const { sequelize, Sequelize } = require('sequelize-test-helpers');

describe('# CartItem model', () => {
    const { DataTypes } = Sequelize;
    const CartItemFactory = proxyquire('../../models/cartItem', {
        sequelize: Sequelize,
        DataTypes: DataTypes
    });
    
    let CartItem;
    before(() => {
        CartItem = CartItemFactory(sequelize, DataTypes);
    })

    after(() => {
        CartItem.init.resetHistory();
    })

    it('called CartItem.init with the correct parameters', () => {
        expect(CartItem.init).to.have.been.calledWith(
          {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            quantity: DataTypes.INTEGER,
            ProductId: DataTypes.INTEGER,
            CartId: DataTypes.INTEGER
          },
          {
            sequelize,
            modelName: 'CartItem'
          }
        );
    })
})
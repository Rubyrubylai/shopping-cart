var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
const proxyquire = require('proxyquire');
const { sequelize, Sequelize } = require('sequelize-test-helpers');

describe('# OrderItem model', () => {
    const { DataTypes } = Sequelize;
    const OrderItemFactory = proxyquire('../../models/orderitem', {
        sequelize: Sequelize,
        DataTypes: DataTypes
    });
    
    let OrderItem;
    before(() => {
        OrderItem = OrderItemFactory(sequelize, DataTypes);
    })

    after(() => {
        OrderItem.init.resetHistory();
    })

    it('called OrderItem.init with the correct parameters', () => {
        expect(OrderItem.init).to.have.been.calledWith(
          {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            quantity: DataTypes.INTEGER,
            price: DataTypes.INTEGER,
            ProductId: DataTypes.INTEGER,
            OrderId: DataTypes.INTEGER
          },
          {
            sequelize,
            modelName: 'OrderItem'
          }
        );
    })
})
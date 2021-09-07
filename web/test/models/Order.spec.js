var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
const proxyquire = require('proxyquire');
const { sequelize, Sequelize } = require('sequelize-test-helpers');

describe('# Order model', () => {
    const { DataTypes } = Sequelize;
    const OrderFactory = proxyquire('../../models/order', {
        sequelize: Sequelize,
        DataTypes: DataTypes
    });
    
    let Order;
    before(() => {
        Order = OrderFactory(sequelize, DataTypes);
    })

    after(() => {
        Order.init.resetHistory();
    })

    it('called Order.init with the correct parameters', () => {
        expect(Order.init).to.have.been.calledWith(
          {
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
          },
          {
            sequelize,
            modelName: 'Order'
          }
        );
    })

    context('associations', () => {
        const Product = 'dummy product';
        const User = 'dummy user';
        const Payment = 'dummy payment';
        let OrderItem;
        before(() => {
            Order.associate({ Product });
            Order.associate({ User });
            Order.associate({ Payment });
        });

        it("defined a belongsToMany association with Product", () => {
            expect(Order.belongsToMany).to.have.been.calledWith(Product, {
                through: OrderItem,
                foreignKey: 'OrderId',
                as: 'items'
            });
        });

        it("defined a belongsTo association with User", () => {
            expect(Order.belongsTo).to.have.been.calledWith(User);
        });

        it("defined a hasMany association with Payment", () => {
            expect(Order.hasMany).to.have.been.calledWith(Payment);
        });
    });
})
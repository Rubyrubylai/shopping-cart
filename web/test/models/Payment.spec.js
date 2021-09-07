var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
const proxyquire = require('proxyquire');
const { sequelize, Sequelize } = require('sequelize-test-helpers');

describe('# Payment model', () => {
    const { DataTypes } = Sequelize;
    const PaymentFactory = proxyquire('../../models/payment', {
        sequelize: Sequelize,
        DataTypes: DataTypes
    });
    
    let Payment;
    before(() => {
        Payment = PaymentFactory(sequelize, DataTypes);
    })

    after(() => {
        Payment.init.resetHistory();
    })

    it('called Payment.init with the correct parameters', () => {
        expect(Payment.init).to.have.been.calledWith(
          {
            sn: DataTypes.STRING,
            amount: DataTypes.INTEGER,
            payment_method: DataTypes.STRING,
            paid_at: DataTypes.DATE,
            params: DataTypes.TEXT,
            OrderId: DataTypes.INTEGER
          },
          {
            sequelize,
            modelName: 'Payment'
          }
        );
    })

    context('associations', () => {
        const Order = 'dummy order';
        before(() => {
            Payment.associate({ Order });
        });

        it("defined a belongsTo association with Order", () => {
            expect(Payment.belongsTo).to.have.been.calledWith(Order);
        });
    });
})
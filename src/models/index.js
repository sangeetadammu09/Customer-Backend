const dbConfig = require('../config/dbConfig.js');

const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,

        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle
        }
    }
)

sequelize.authenticate().then(() => {
    console.log('connected..')
}).catch(err => {
    console.log('Error'+ err)
})

const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize

db.address = require('./addressModel.js')(sequelize, DataTypes)

db.customer = require('./customerModel.js')(sequelize, DataTypes,)

db.sequelize.sync({ force: false })
.then(() => {
    console.log('Database re-synced!')
})


// 1 to 1 Relation

db.customer.hasOne(db.address,{
    foreignKey: 'customerId',
    as: 'address'
})

db.address.belongsTo(db.customer,{
    foreignKey: 'customerId',
    as: 'customer',
    onDelete: 'CASCADE'
})


module.exports = db

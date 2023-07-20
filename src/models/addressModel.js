module.exports = (sequelize, DataTypes) => {

    const Address = sequelize.define("address", {
        addressId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        landmark: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false
        },  
        country: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "India"
        }, 
        zipCode : {
            type: DataTypes.INTEGER,
            allowNull: false,
        },  
        customerId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },  
        
        
    
    })

    return Address

}
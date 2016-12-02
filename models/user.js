module.exports = function(sequelize, DataTypes){
  return sequelize.define('user',{
    email:{
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[a-z\!\$\#\*\d]{8,64}$/gmi,
        len: [8, 64]
      }
    }
  })
}

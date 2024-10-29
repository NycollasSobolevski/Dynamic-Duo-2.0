const Sequelize = require('sequelize');
const database  = require('../config/db');

const colaborador = require('./colaborador')
const ferramenta = require('./ferramenta')

const emprestimo = database.define('Emprestimo', {
    ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    emprestadoAs: {
        type: Sequelize.DATE,
        allowNull: false
    },
    devolvidoAs: {
        type: Sequelize.DATE,
        allowNull: true
    }
})

module.exports = emprestimo;

emprestimo.belongsTo(colaborador, {
    constraint: true,
    foreignKey: "EDV"
});
emprestimo.belongsTo(ferramenta, {
    constraint: true,
    foreignKey: "IDFerramenta"
});
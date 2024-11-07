// Importando as tabelas do DB
const colaborador = require('../model/colaborador');
const armario = require('../model/armario');
const compartimento = require('../model/compartimento');
const ferramenta = require('../model/ferramenta');
const gaveta = require('../model/gaveta');
const subtipo = require('../model/subtipo');
const tipo = require('../model/tipo');
const emprestimo = require('../model/emprestimo');


module.exports = {
    async armarios(req, res) {
        const excluirid = -1;
        const EDV = req.params.EDV;
        const id = -1;
        const pessoa = await colaborador.findAll({
            raw: true,
            attributes:['EDV','IDENTIFICACAO','CARTAO','ADMIN'],
            where: {EDV:EDV}
        })
        const SelectItem = await armario.findAll({
                raw: true,
                attributes: ['IDArmario', 'IDENTIFICACAO']
            });
        const item = "Armários"
        res.render('../views/armarios', {item, SelectItem, EDV, id, excluirid, pessoa, excluir:false});
    },

    async gavetas(req, res) {
        const excluirid = -1;
        const EDV = req.params.EDV;
        const pessoa = await colaborador.findAll({
            raw: true,
            attributes:['EDV','IDENTIFICACAO','CARTAO','ADMIN'],
            where: {EDV:EDV}
        })
        const id = req.params.armario;
        const SelectItem = await gaveta.findAll({
                raw: true,
                attributes: ['IDGaveta', 'IDENTIFICACAO', 'CONTEUDO'],
                where: { IDArmario: id }
            });
        const item = "Gavetas"
        res.render('../views/armarios', {item, SelectItem, EDV, id, pessoa, excluirid, excluir:false});
    },

    async compartimentos(req, res) {
        const excluirid = -1;
        const EDV = req.params.EDV;
        const pessoa = await colaborador.findAll({
            raw: true,
            attributes:['EDV','IDENTIFICACAO','CARTAO','ADMIN'],
            where: {EDV:EDV}
        })
        const id = req.params.gaveta;
        const SelectItem = await compartimento.findAll({
                raw: true,
                attributes: ['IDCompartimento', 'IDENTIFICACAO', 'CONTEUDO'],
                where: { IDGaveta: id }
            });
        const item = "Compartimentos"
        res.render('../views/armarios', {item, SelectItem, EDV, id, pessoa, excluirid, excluir:false});
    },

    async ferramentas(req, res) {
        const excluirid = -1;
        const EDV = req.params.EDV;
        const pessoa = await colaborador.findAll({
            raw: true,
            attributes:['EDV','IDENTIFICACAO','CARTAO','ADMIN'],
            where: {EDV:EDV}
        })
        const colaboradores = await colaborador.findAll({
            raw: true,
            attributes:['EDV','IDENTIFICACAO','CARTAO','ADMIN'],
        })
        const id = req.params.compartimento;
        let SelectItem = await ferramenta.findAll({
                raw: true,
                attributes: ['IDFerramenta', 'IDENTIFICACAO', 'DESCRICAO', 'STATUS', 'EDV', 'QUANTIDADE'],
                where: { IDCompartimento: id }
            });
        const item = "Ferramentas"


        const selectItem = await Promise.all(
            SelectItem.map(async (e) => {
                const emUso = await emprestimo.findAll({
                    raw: true,
                    attributes: ['IDFerramenta', 'devolvidoAs'],
                    where: { IDFerramenta: e.IDFerramenta, devolvidoAs: null }
                });
        
                return {
                    IDENTIFICACAO: e.IDENTIFICACAO,
                    DESCRICAO: e.DESCRICAO,
                    STATUS: e.STATUS,
                    QUANTIDADE: e.QUANTIDADE,
                    UTILIZADAS: emUso.length,
                    IDFerramenta: e.IDFerramenta
                };
            })
        );
        console.log('selectItem');
        console.log(selectItem);
        SelectItem = selectItem;
        res.render('../views/armarios', {item, SelectItem, EDV, id, pessoa, excluirid, colaboradores, excluir:false});
    },

}

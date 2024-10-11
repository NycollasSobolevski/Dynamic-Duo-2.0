// Importando as tabelas do DB
const ferramenta = require('../model/ferramenta');
const armario = require('../model/armario');
const gaveta = require('../model/gaveta');
const compartimento = require('../model/compartimento');
const tipo = require('../model/tipo');
const subtipo = require('../model/subtipo');
const colaborador = require('../model/colaborador');

const Conection = require('../config/firebase');
module.exports = {
    async retirar(req, res) {
        const EDV = req.params.EDV;
        const id = req.params.ferramenta;

        const tool = await ferramenta.findOne({
            raw: true,
            attributes: ['IDGaveta','IDFerramenta','IDArmario', 'IDENTIFICACAO'],
            where: { IDFerramenta: id }
        });
        const armarinho = await armario.findOne({
            raw:true,
            attributes: ['IDArmario', 'IDENTIFICACAO'],
            where: { IDArmario: tool.IDArmario }
        });
        const gavetinha = await gaveta.findOne({
            raw:true,
            attributes: ['IDGaveta', 'IDENTIFICACAO'],
            where: { IDGaveta: tool.IDGaveta }
        })

        await Conection.open(armarinho.IDENTIFICACAO, gavetinha.IDENTIFICACAO);

        console.log(`ferramenta devolvida (${armarinho.IDENTIFICACAO} - ${gavetinha.IDENTIFICACAO} - ${tool.IDENTIFICACAO})`);

        await ferramenta.update({
            EDV: EDV,
            STATUS: 'Retirada',
        },{
            where: { IDFerramenta: id }
        });

        console.log("ferramenta retirada");

        setTimeout(function(){
            res.render('../views/index', {retirar:false, devolver:false, cadastrar:false,retirarEdv:false, devolverEdv:false, cadastrarEdv:false, mensage:''});
        }, 1500);
    },

    async devolver(req, res) {
        const EDV = req.params.EDV;
        const id = req.params.ferramenta;

        const tool = await ferramenta.findOne({
            raw:true,
            attributes: ['IDENTIFICACAO','IDGaveta', 'IDArmario'],
            where : { IDFerramenta: id }
        });

        const armarinho = await armario.findOne({
            raw:true,
            attributes: ['IDArmario', 'IDENTIFICACAO'],
            where: { IDArmario: tool.IDArmario }
        });
        const gavetinha = await gaveta.findOne({
            raw:true,
            attributes: ['IDGaveta', 'IDENTIFICACAO'],
            where: { IDGaveta: 16 }
        })

        await Conection.open(armarinho.IDENTIFICACAO, gavetinha.IDENTIFICACAO);
        await ferramenta.update({
            EDV: '',
            STATUS: '',
        },
        {
            where: { IDFerramenta: id }
        });

        console.log('------------ mover / devolver ---------------');
        console.log(armarinho);
        console.log(gavetinha);
        console.log(tool);
        console.log('------------ -------------------------------');

        console.log(`ferramenta devolvida (${armarinho.IDENTIFICACAO} - ${gavetinha.IDENTIFICACAO} - ${tool.IDENTIFICACAO})`);

        setTimeout(function(){
            res.render('../views/index', {retirar:false, devolver:false, cadastrar:false,retirarEdv:false, devolverEdv:false, cadastrarEdv:false, mensage:''});
        }, 1500);        
    },

    async exibir(req, res) {
        const EDV = req.params.EDV;

        const retiradas = await ferramenta.findAll({
            raw: true,
            attributes: ['IDFerramenta', 'IDENTIFICACAO'],
            where: { EDV: EDV }
        });

        res.render('../views/index', {retiradas});
    },

    async confirmadevolucao(req, res) {
        const EDV = req.params.EDV;
        const id = req.params.ferramenta;

        const pessoa = await colaborador.findAll({
            raw: true,
            attributes: ['EDV','IDENTIFICACAO','CARTAO','ADMIN'],
            where: {EDV: EDV},
        });

        const ferramentas = await ferramenta.findAll({
            raw: true,
            attributes: ['IDFerramenta', 'IDENTIFICACAO', 'IDTipo', 'IDSubtipo', 'IDArmario', 'IDGaveta', 'IDCompartimento'],
            where: { IDFerramenta: id }
        });
        
        const tipos = (await tipo.findAll({
            raw: true,
            attributes: ['IDENTIFICACAO'],
            where: { IDTipo: ferramentas[0].IDTipo }
        }))[0].IDENTIFICACAO;

        var subtipos = (await subtipo.findAll({
            raw: true,
            attributes: ['IDENTIFICACAO'],
            where: { IDSubtipo: ferramentas[0].IDSubtipo }
        }))

        if (subtipos.length == 0) {
            subtipos = ' -----';
        }
        else {
            subtipos = subtipos[0].IDENTIFICACAO;
        }

        const armarios = (await armario.findAll({
            raw: true,
            attributes: ['IDENTIFICACAO'],
            where: { IDArmario: ferramentas[0].IDArmario }
        }))[0].IDENTIFICACAO;

        const gavetas = (await gaveta.findAll({
            raw: true,
            attributes: ['IDENTIFICACAO'],
            where: { IDGaveta: ferramentas[0].IDGaveta }
        }))[0].IDENTIFICACAO;

        const compartimentos = (await compartimento.findAll({
            raw: true,
            attributes: ['IDENTIFICACAO'],
            where: { IDCompartimento: ferramentas[0].IDCompartimento }
        }))[0].IDENTIFICACAO;

        const acao = 1;

        res.render('../views/confirmacao', {ferramentas, EDV, tipos, subtipos, armarios, gavetas, compartimentos, acao, pessoa})
    },

    async confirmaretirada(req, res) {
        const EDV = req.params.EDV;
        const id = req.params.ferramenta;

        const pessoa = await colaborador.findAll({
            raw: true,
            attributes: ['EDV','IDENTIFICACAO','CARTAO','ADMIN'],
            where: {EDV: EDV},
        });

        const ferramentas = await ferramenta.findAll({
            raw: true,
            attributes: ['IDFerramenta', 'IDENTIFICACAO', 'IDTipo', 'IDSubtipo', 'IDArmario', 'IDGaveta', 'IDCompartimento'],
            where: { IDFerramenta: id }
        });
        
        const tipos = (await tipo.findAll({
            raw: true,
            attributes: ['IDENTIFICACAO'],
            where: { IDTipo: ferramentas[0].IDTipo }
        }))[0].IDENTIFICACAO;

        var subtipos = (await subtipo.findAll({
            raw: true,
            attributes: ['IDENTIFICACAO'],
            where: { IDSubtipo: ferramentas[0].IDSubtipo }
        }))

        if (subtipos.length == 0) {
            subtipos = ' -----';
        }
        else {
            subtipos = subtipos[0].IDENTIFICACAO;
        }

        const armarios = (await armario.findAll({
            raw: true,
            attributes: ['IDENTIFICACAO'],
            where: { IDArmario: ferramentas[0].IDArmario }
        }))[0].IDENTIFICACAO;

        const gavetas = (await gaveta.findAll({
            raw: true,
            attributes: ['IDENTIFICACAO'],
            where: { IDGaveta: ferramentas[0].IDGaveta }
        }))[0].IDENTIFICACAO;

        const compartimentos = (await compartimento.findAll({
            raw: true,
            attributes: ['IDENTIFICACAO'],
            where: { IDCompartimento: ferramentas[0].IDCompartimento }
        }))[0].IDENTIFICACAO;

        const acao = 0;

        res.render('../views/confirmacao', {ferramentas, EDV, tipos, subtipos, armarios, gavetas, compartimentos, acao, pessoa})
    }
}

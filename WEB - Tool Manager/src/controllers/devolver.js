const ferramenta = require('../model/ferramenta');
const armario = require('../model/armario');
const gaveta = require('../model/gaveta');
const compartimento = require('../model/compartimento');
const tipo = require('../model/tipo');
const subtipo = require('../model/subtipo');
const colaborador = require('../model/colaborador');
const emprestimo = require('../model/emprestimo');

module.exports = {
    async pagDevolverGet(req, res) {
        const EDV = req.body.edv
        const cartao = req.body.cartao
        const tipos = [];
        const subtipos = [];
        const armarios = [];
        const gavetas = [];
        const compartimentos = [];
        const ferramentas = []
        PorCartao: {
            if (cartao != '') {
                const pessoa = await colaborador.findOne({
                    raw: true,
                    attributes: ['EDV', 'IDENTIFICACAO', 'CARTAO', 'ADMIN'],
                    where: { CARTAO: cartao },
                });
                if (pessoa == undefined) {
                    res.render('../views/index', {
                        retirar: false, devolver: false, cadastrar: false,
                        retirarEdv: false, devolverEdv: false, cadastrarEdv: false, mensage: 'Pessoa nao cadastrada'
                    });
                    console.log('passou');
                    break PorCartao;
                }
                const emprestimos = await emprestimo.findAll({
                    raw: true,
                    attributes: ['emprestadoAs','devolvidoAs', 'EDV', 'IDFerramenta'],
                    where: { EDV: pessoa.EDV, devolvidoAs: null},
                })

                const ferramentasBanco = await ferramenta.findAll({
                    raw: true,
                    attributes: ['IDFerramenta', 'IDENTIFICACAO', 'DESCRICAO', 'STATUS', 'IDTipo', 'IDSubtipo', 'IDArmario', 'IDGaveta', 'IDCompartimento'],
                    where: { IDFerramenta: [...new Set(emprestimos.map(e => e.IDFerramenta))] },
                });

                for (let i = 0; i < emprestimos.length; i++) {
                    const empAtual = emprestimos[i];
                    const ferAtual = ferramentasBanco.filter((e) => e.IDFerramenta == empAtual.IDFerramenta)
                    ferramentas.push(ferAtual[0])
                    var temp = await tipo.findAll({
                        raw: true,
                        attributes: ['IDENTIFICACAO'],
                        where: { IDTipo: ferAtual[0].IDTipo }
                    })
                    tipos.push(temp[0].IDENTIFICACAO);

                    temp = await armario.findAll({
                        raw: true,
                        attributes: ['IDENTIFICACAO'],
                        where: { IDArmario: ferAtual[0].IDArmario }
                    })
                    armarios.push(temp[0].IDENTIFICACAO);

                    temp = await gaveta.findAll({
                        raw: true,
                        attributes: ['IDENTIFICACAO'],
                        where: { IDGaveta: ferAtual[0].IDGaveta }
                    })
                    gavetas.push(temp[0].IDENTIFICACAO);

                    temp = await compartimento.findAll({
                        raw: true,
                        attributes: ['IDENTIFICACAO'],
                        where: { IDCompartimento: ferAtual[0].IDCompartimento }
                    })
                    compartimentos.push(temp[0].IDENTIFICACAO);

                    temp = await subtipo.findAll({
                        raw: true,
                        attributes: ['IDENTIFICACAO'],
                        where: { IDSubtipo: ferAtual[0].IDSubtipo }
                    })

                    if (temp.length == 0) {
                        subtipos.push('-----');
                    }
                    else {
                        subtipos.push(temp[0].IDENTIFICACAO);
                    }

                }

                res.render('../views/devolver', { EDV, ferramentas, tipos, subtipos, armarios, gavetas, compartimentos, pessoa });
            };
        };
        PorEdv: {
            if (EDV != '') {
                const pessoa = await colaborador.findAll({
                    raw: true,
                    attributes: ['EDV', 'IDENTIFICACAO', 'CARTAO', 'ADMIN'],
                    where: { EDV: EDV },
                });
                if (pessoa[0] == undefined) {
                    res.render('../views/index', {
                        retirar: false, devolver: false, cadastrar: false,
                        retirarEdv: false, devolverEdv: false, cadastrarEdv: false, mensage: 'Pessoa nao cadastrada'
                    });
                    break PorEdv;
                }
                const ferramentas = await ferramenta.findAll({
                    raw: true,
                    attributes: ['IDFerramenta', 'IDENTIFICACAO', 'DESCRICAO', 'STATUS', 'IDTipo', 'IDSubtipo', 'IDArmario', 'IDGaveta', 'IDCompartimento'],
                    where: { EDV: pessoa[0].EDV },
                });

                for (let i = 0; i < ferramentas.length; i++) {
                    var temp = await tipo.findAll({
                        raw: true,
                        attributes: ['IDENTIFICACAO'],
                        where: { IDTipo: ferramentas[i].IDTipo }
                    })
                    tipos.push(temp[0].IDENTIFICACAO);

                    temp = await armario.findAll({
                        raw: true,
                        attributes: ['IDENTIFICACAO'],
                        where: { IDArmario: ferramentas[i].IDArmario }
                    })
                    armarios.push(temp[0].IDENTIFICACAO);

                    temp = await gaveta.findAll({
                        raw: true,
                        attributes: ['IDENTIFICACAO'],
                        where: { IDGaveta: ferramentas[i].IDGaveta }
                    })
                    gavetas.push(temp[0].IDENTIFICACAO);

                    temp = await compartimento.findAll({
                        raw: true,
                        attributes: ['IDENTIFICACAO'],
                        where: { IDCompartimento: ferramentas[i].IDCompartimento }
                    })
                    compartimentos.push(temp[0].IDENTIFICACAO);

                    temp = await subtipo.findAll({
                        raw: true,
                        attributes: ['IDENTIFICACAO'],
                        where: { IDSubtipo: ferramentas[i].IDSubtipo }
                    })

                    if (temp.length == 0) {
                        subtipos.push('-----');
                    }
                    else {
                        subtipos.push(temp[0].IDENTIFICACAO);
                    }

                }

                res.render('../views/devolver', { EDV, ferramentas, tipos, subtipos, armarios, gavetas, compartimentos, pessoa });
            };
        };
    },

}
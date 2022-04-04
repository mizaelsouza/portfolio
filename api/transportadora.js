const {converteData, converteDataEN} = require("../funcoes/converte");

module.exports = (app) => {
    //CADASTRAR FORNECEDOR
    const cadastrar_TRANSPORTADORA = async (req, res) => {
        try {
            const { dtCadastro, observacao } = req.body;
            const {
                nome,
                cep,
                logradouro,
                numero,
                bairro,
                complemento,
                municipioId,
                ufId,
            } = req.body;

            const pessoa = {
                nome,
                cep,
                logradouro,
                numero,
                bairro,
                complemento,
                municipioId,
                ufId,
            };
            await app.db.transaction(async (trans) => {
                const resultPessoa = await app
                    .db("pessoas")
                    .transacting(trans)
                    .insert(pessoa);

                const transportadora = {
                    dtCadastro: converteDataEN(dtCadastro),
                    observacao,
                    pessoasId: resultPessoa[0],
                };

                /* const contatos = {
                    telefone,
                    celular,
                    email,
                    site,
                    pessoasId: resultPessoa[0],
                };*/

                if (resultPessoa[0] > 0) {
                    const resultTransportadora = await app
                        .db("transportadora")
                        .transacting(trans)
                        .insert(transportadora);

                    /*  const resultContatos = await app
                        .db("contatos")
                        .transacting(trans)
                        .insert(contatos);*/

                    if (resultTransportadora[0] > 0) {
                        res.status(200).send({
                            sucesso: "TRANSPORTADORA cadastrada com sucesso.",
                        });
                    }
                }
            });
        } catch (error) {
            res.status(500).send({
                error: "FALHA ao cadsatrar TRANSPORTADORA.",
                motivo: error,
            });
        }
    };

    const deletar_TRANSPORTADORA = async (req, res) => {
        const pessoasId = req.params.id;

        try {
            await app.db.transaction(async (trans) => {
                const result = await app
                    .db("pessoas")
                    .transacting(trans)
                    .where({ id: pessoasId })
                    .del();
                if (result > 0) {
                    res.json({
                        sucesso: "SUCESSO ao deletar dados.",
                    });
                } else {
                    res.json({
                        aviso: "ATENÇÃO ARQUIVO NÃO DELETADO.",
                    });
                }
            });
        } catch (error) {
            res.status(500).send({
                error: "FALHA ao deletar dados.",
                motivo: error,
            });
        }
    };

    //LISTAR FORNECEDOR
    const listar_TRANSPORTADORA = async (req, res) => {
        try {
            const { page = 1, limite = 12 } = req.query;

            const query = await app.db
                .select(
                    "transportadora.id",                    
                    "pessoas.nome",
                    app.db.raw('DATE_FORMAT(transportadora.dtCadastro, "%d/%m/%Y") as dtCadastro'),
                    "pessoas.cep",
                    "pessoas.logradouro",
                    "pessoas.numero",
                    "pessoas.complemento",
                    "pessoas.bairro",
                    "municipio.nome as cidade",
                    "uf.sigla as uf",
                    "observacao"
                    )
                .table("transportadora")
                .join('pessoas','pessoasId','pessoas.id')
                .join('municipio','municipioId','municipio.id')
                .join('uf','pessoas.ufId','uf.id')
                .limit(limite)
                .offset((page - 1) * limite);

            const [count] = await app.db("transportadora").count();
            const totalPage = Math.ceil(count["count(*)"] / limite);
            const pageAtual = parseInt(page);

            res.json({
                Total: count["count(*)"],
                Paginas: totalPage,
                PaginaAtual: pageAtual,
                Tranportadora: query,
            });
        } catch (error) {
            res.json({
                mensagem: "Verifique, ocorreu erro ao TRANSPORTADORA os dados",
                motivo: error,
            });
        }
    };


    //ATUALIZAR

    const atualizar_TRANSPORTADORA = async (req, res) => {
        try {
            const id = req.params.id
            const { dtCadastro, observacao } = req.body;
            const {
                nome,
                cep,
                logradouro,
                numero,
                bairro,
                complemento,
                municipioId,
                ufId,
            } = req.body;

            const pessoa = {
                nome,
                cep,
                logradouro,
                numero,
                bairro,
                complemento,
                municipioId,
                ufId,
            };

            await app.db.transaction(async (trans) => {
                const resultPessoa = await app
                    .db("pessoas")
                    .transacting(trans)
                    .where({ 'pessoas.id': id })
                    .update(pessoa);

                if (resultPessoa <= 0) {
                    return res.status(500).send({ error: 'Informação não localizada.' })
                }



                if (resultPessoa > 0) {
                    const transportadora = {
                        dtCadastro: converteData(dtCadastro),
                        observacao
                    }
                    const resultTransporte = await app
                        .db("transportadora")
                        .transacting(trans)
                        .where({ pessoasId: id })
                        .update(transportadora);


                    if (resultTransporte > 0) {
                        res.status(200).send({
                            sucesso: "TRANSPORTADORA atualizada com sucesso.",
                        });
                    }
                }
            });
        } catch (err) {
            res.status(500).send({
                error: "FALHA ao cadsatrar TRANSPORTADORA.",
                motivo: err,
            });
        }
    };

    return {
        cadastrar_TRANSPORTADORA,
        deletar_TRANSPORTADORA,
        listar_TRANSPORTADORA,
        atualizar_TRANSPORTADORA
    };
};

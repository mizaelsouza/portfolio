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
                    dtCadastro,
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
                .select("*")
                .table("TRANSPORTADORA")
                .limit(limite)
                .offset((page - 1) * limite);

            const [count] = await app.db("TRANSPORTADORA").count();
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

    //LISTAR CNAE

    return {
        cadastrar_TRANSPORTADORA,
        deletar_TRANSPORTADORA,
        listar_TRANSPORTADORA,
    };
};

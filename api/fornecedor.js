module.exports = (app) => {
    //CADASTRAR FORNECEDOR
    const cadastrar_FORNECEDOR = async (req, res) => {
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

                const fornecedor = {
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
                    const resultFornecedor = await app
                        .db("fornecedor")
                        .transacting(trans)
                        .insert(fornecedor);

                    /*  const resultContatos = await app
                        .db("contatos")
                        .transacting(trans)
                        .insert(contatos);*/

                    if (resultFornecedor[0] > 0) {
                        res.status(200).send({
                            sucesso: "FORNECEDOR cadastrada com sucesso.",
                        });
                    }
                }
            });
        } catch (err) {
            res.status(500).send({
                error: "FALHA ao cadsatrar FORNECEDOR.",
                motivo: err,
            });
        }
    };

    const deletar_FORNECEDOR = async (req, res) => {
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
    const listar_FORNECEDOR = async (req, res) => {
        try {
            const { page = 1, limite = 12 } = req.query;

            const query = await app.db
                .select("*")
                .table("FORNECEDOR")
                .limit(limite)
                .offset((page - 1) * limite);

            const [count] = await app.db("FORNECEDOR").count();
            const totalPage = Math.ceil(count["count(*)"] / limite);
            const pageAtual = parseInt(page);

            res.json({
                Total: count["count(*)"],
                Paginas: totalPage,
                PaginaAtual: pageAtual,
                FORNECEDOR: query,
            });
        } catch (error) {
            res.json({
                mensagem: "Verifique, ocorreu erro ao FORNECEDOR os dados",
                motivo: error,
            });
        }
    };

    //LISTAR CNAE

    return {
        cadastrar_FORNECEDOR,
        deletar_FORNECEDOR,
        listar_FORNECEDOR,
    };
};

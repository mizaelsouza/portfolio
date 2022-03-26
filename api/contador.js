module.exports = (app) => {
    //CADASTRAR CONTADOR
    const cadastrar_CONTADOR = async (req, res) => {
        try {
            const { crcInscricao, ufIncricao } = req.body;
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

                if (resultPessoa[0] > 0) {
                    const contador = {
                        crcInscricao,
                        ufId: ufIncricao,
                        pessoasId: resultPessoa[0],
                    };
                    await app
                        .db("contador")
                        .transacting(trans)
                        .insert(contador);

                    res.status(200).send({
                        sucesso: "CONTADOR registrado com sucesso.",
                    });
                }
            });
        } catch (error) {
            res.status(200).send({
                sucesso: "FALHA ao registradar tabela CONTADOR.",
                error: error,
            });
        }
    };

    const deletar_CONTADOR = async (req, res) => {
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

    //LISTAR CONTADOR
    const listar_CONTADOR = async (req, res) => {
        try {
            const { page = 1, limite = 12 } = req.query;

            const query = await app.db
                .select(
                    "contador.id",
                    "pessoas.nome",
                    "bairro",
                    "cep",
                    "logradouro",
                    "numero",
                    "complemento",
                    "municipio.nome as cidade",
                    "uf.nome as ufEmissor",
                )
                .table("contador")
                .join("pessoas", "pessoasId", "pessoas.id")
                .join("municipio", "municipioId", "municipio.id")
                .join("uf", "contador.ufId", "uf.id")

                .limit(limite)
                .offset((page - 1) * limite);

            const [count] = await app.db("contador").count();
            const totalPage = Math.ceil(count["count(*)"] / limite);
            const pageAtual = parseInt(page);

            res.json({
                Total: count["count(*)"],
                Paginas: totalPage,
                PaginaAtual: pageAtual,
                Contador: query,
            });
        } catch (error) {
            res.json({
                mensagem: "Verifique, ocorreu erro ao CONTADOR os dados",
                motivo: error,
            });
        }
    };

    //LISTAR CNAE

    return {
        cadastrar_CONTADOR,
        deletar_CONTADOR,
        listar_CONTADOR,
    };
};

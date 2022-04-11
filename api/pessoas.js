module.exports = (app) => {
    //CADASTRAR CLIENTE PESSOA FISICA
    const cadastrar_CLIENTEPF = async (req, res) => {
        const { nome, cep, logradouro, numero, bairro, complemento, municipioId, ufId } = req.body;
        const { cpf, rg, dtNascimento, nomePai, nomeMae, sexoId } = req.body;

        const pessoas = {
            nome,
            cep,
            logradouro,
            numero,
            bairro,
            complemento,
            municipioId,
            ufId
        };


        try {
            await app.db.transaction(async (trans) => {
                const resultPJ = await app.db("pessoas").transacting(trans).insert(pessoas);

                if (resultPJ[0] > 0) {
                    const pessoaPF = {
                        cpf, rg, dtNascimento, nomePai, nomeMae, sexoId, pessoasId: resultPJ[0]
                    };
                    const result = await app.db("pessoa_fisica").transacting(trans).insert(pessoaPF);

                    if (result[0] > 0) {
                        res.status(200).send({
                            sucesso: "CLIENTE cadastro com sucesso",
                        });
                    }
                }
            });
        } catch (error) {
            res.status(500).send({
                error: "CLIENTE não cadastrado.",
                motivo: error,
            });
        }
    };

    //CADASTRAR EVENTO DO FUNCIONARIO
    const cadastrar_CLIENTEPJ = async (req, res) => {
        const { nome, cep, logradouro, numero, bairro, complemento, municipioId, ufId } = req.body;
        const { cnpj, nomeFantasia, ie, dtConstituicao, crtId } = req.body;

        const pessoas = {
            nome,
            cep,
            logradouro,
            numero,
            bairro,
            complemento,
            municipioId,
            ufId
        };




        try {
            await app.db.transaction(async (trans) => {
                const resultPJ = await app.db("pessoas").transacting(trans).insert(pessoas);

                if (resultPJ[0] > 0) {

                    const pessoaPJ = {
                        cnpj,
                        nomeFantasia,
                        ie,
                        dtConstituicao,
                        crtId,
                        pessoasId: resultPJ[0]
                    };

                    const result = await app.db("pessoa_juridica").transacting(trans).insert(pessoaPJ);
                    if (result[0] > 0) {
                        res.status(200).send({
                            sucesso: "CLIENTE cadastro com sucesso",
                        });
                    }
                }
            });
        } catch (err) {
            if (err.code === "ER_DUP_ENTRY") {
                res.status(400).json({
                    status: 400,
                    mensagem: "CLIENTE já esta cadastro.",
                    "motivo:": err.sqlMessage,
                });
            }

            if (err.code === "ER_NO_REFERENCED_ROW_2") {
                res.status(202).json({
                    status: 202,
                    mensagem:
                        "CLIENTE não encontrado ou tabela REGIME_TRIBUTARIO vazia.",
                });
            } else {
                res.status(500).json({
                    status: 500,
                    mensagem: "Verifique os erros abaixo.",
                    err,
                });
            }
        }
    };

    const deletar_CLIENTEPFEPJ = async (req, res) => {
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



    //LISTAR CLIENTE PESSOA FISICA
    const listar_CLIENTEPF = async (req, res) => {
        try {
            const { page = 1, limite = 12 } = req.query;

            const query = await app.db
                .select(         
                    "pessoa_fisica.id as codigo",
                    "pessoas.nome",                    
                    "pessoa_fisica.cpf",
                    "pessoa_fisica.rg",
                    app.db.raw('DATE_FORMAT(pessoa_fisica.dtNascimento, "%d/%m/%Y") as Data'), 
                    "pessoas.bairro",
                    "pessoas.cep",
                    "pessoas.logradouro",
                    "pessoas.numero",
                    "pessoas.complemento",
                    "municipio.nome as cidade",
                    "uf.nome as uf")
                .table("pessoas")
                .join('pessoa_fisica', 'pessoa_fisica.pessoasId', 'pessoas.id')
                .join('uf', 'uf.id', 'ufId')
                .join('municipio', 'municipio.id', 'municipioId')
                .limit(limite)
                .offset((page - 1) * limite);

            const [count] = await app.db("pessoas").count();
            const totalPage = Math.ceil(count["count(*)"] / limite);
            const pageAtual = parseInt(page);

            res.json({
                Total: count["count(*)"],
                Paginas: totalPage,
                PaginaAtual: pageAtual,
                ClientePF: query,
            });
        } catch (error) {
            res.json({
                mensagem: "Verifique, ocorreu erro ao CLIENTES os dados",
                motivo: error,
            });
        }
    };


    const listar_CLIENTEPJ = async (req, res) => {
        try {
            const { page = 1, limite = 12 } = req.query;

            const query = await app.db
                .select(
                    "pessoa_juridica.id as codigo",
                    "pessoas.nome",
                    "pessoa_juridica.nomeFantasia",
                    "pessoa_juridica.cnpj",
                    "pessoa_juridica.ie",
                    app.db.raw('DATE_FORMAT(pessoa_juridica.dtConstituicao, "%d/%m/%Y") as Data'),                     
                    "pessoas.bairro",
                    "pessoas.cep",
                    "pessoas.logradouro",
                    "pessoas.numero",
                    "pessoas.complemento",
                    "municipio.nome as cidade",
                    "uf.nome as uf")
                .table("pessoas")
                .join('pessoa_juridica', 'pessoa_juridica.pessoasId', 'pessoas.id')
                .join('uf', 'uf.id', 'ufId')
                .join('municipio', 'municipio.id', 'municipioId')
                .limit(limite)
                .offset((page - 1) * limite);

            const [count] = await app.db("pessoas").count();
            const totalPage = Math.ceil(count["count(*)"] / limite);
            const pageAtual = parseInt(page);

            res.json({
                Total: count["count(*)"],
                Paginas: totalPage,
                PaginaAtual: pageAtual,
                ClientePJ: query,
            });
        } catch (error) {
            res.json({
                mensagem: "Verifique, ocorreu erro ao CLIENTES os dados",
                motivo: error,
            });
        }
    };

    //LISTAR CNAE

    return {
        cadastrar_CLIENTEPF,
        cadastrar_CLIENTEPJ,
        deletar_CLIENTEPFEPJ,
        listar_CLIENTEPF,
        listar_CLIENTEPJ,

    };
};

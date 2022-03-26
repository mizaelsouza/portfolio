module.exports = (app) => {
    //CADASTRAR EVENTO DO FUNCIONARIO
    const cadastrar_EVENTO = (req, res) => {
        app.db("rh_evento")
            .insert(req.body)
            .then((_) => {
                res.status(200).send({
                    sucesso: "EVENTO registrado com sucesso.",
                });
            })
            .catch((err) => {
                res.status(500).send({
                    error: "FALHA ao registrado EVENTO.",
                    err,
                });
            });
    };

    //CADASTRAR EVENTO DO FUNCIONARIO
    const cadastrar_DEPARTAMENTO = (req, res) => {
        app.db("rh_departamento")
            .insert(req.body)
            .then((_) => {
                res.status(200).send({
                    sucesso: "DEPARTAMENTO registrado com sucesso.",
                });
            })
            .catch((err) => {
                res.status(500).send({
                    error: "FALHA ao registrado DEPARTAMENTO.",
                    err,
                });
            });
    };

    //CADASTRAR EVENTO DO FUNCIONARIO
    const cadastrar_FUNCAO = (req, res) => {
        app.db("rh_funcao")
            .insert(req.body)
            .then((_) => {
                res.status(200).send({
                    sucesso: "FUNÇÂO registrado com sucesso.",
                });
            })
            .catch((err) => {
                res.status(500).send({
                    error: "FALHA ao registrado FUNÇÂO.",
                    err,
                });
            });
    };

    //CADASTRAR EVENTO DO FUNCIONARIO
    const cadastrar_HORARIO_TRABALHO = (req, res) => {
        app.db("rh_horario_trabalho")
            .insert(req.body)
            .then((_) => {
                res.status(200).send({
                    sucesso: "HORARIO registrado com sucesso.",
                });
            })
            .catch((err) => {
                res.status(500).send({
                    error: "FALHA ao registrado HORARIO.",
                    err,
                });
            });
    };

    //CADASTRAR COLABORADOR
    const cadastrar_COLABORADOR = async (req, res) => {
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

        const pessoas = {
            nome,
            cep,
            logradouro,
            numero,
            bairro,
            complemento,
            municipioId,
            ufId,
        };

        const {
            dtAdmissao,
            dtDemissao,
            salarioBase,
            pisPasep,
            carteiraNumero,
            carteiraSerie,
            carteiraOrgoEmissor,
            observacao,
            rhDepartamentoId,
            rhFuncaoId,
            rhHorarioTrabalhoId,
        } = req.body;

        try {
            await app.db.transaction(async (trans) => {
                const resultPessoas = await app
                    .db("pessoas")
                    .transacting(trans)
                    .insert(pessoas);

                if (resultPessoas[0] > 0) {
                    const colaborador = {
                        dtAdmissao,
                        dtDemissao,
                        salarioBase,
                        pisPasep,
                        carteiraNumero,
                        carteiraSerie,
                        carteiraOrgoEmissor,
                        observacao,
                        rhDepartamentoId,
                        rhFuncaoId,
                        rhHorarioTrabalhoId,
                        pessoasId: resultPessoas[0],
                    };
                    const result = await app
                        .db("colaborador")
                        .transacting(trans)
                        .insert(colaborador);
                    if (result[0] > 0) {
                        res.status(200).send({
                            sucesso: "COLABORADOR cadastro com sucesso",
                        });
                    }
                }
            });
        } catch (error) {
            if (error.code === "ER_DUP_ENTRY") {
                res.status(202).json({
                    status: 202,
                    mensagem: "COLABORADOR já esta cadastrado.",
                    "motivo:": error.sqlMessage,
                });
            }
            if (error.code === "ER_NO_REFERENCED_ROW_2") {
                res.status(500).json({
                    status: 500,
                    mensagem: "COLABORADOR veriquei as tabelas depentendes.",
                });
            } else {
                res.status(500).json({
                    status: 500,
                    mensagem: "Verifique os error abaixo.",
                    error,
                });
            }
        }
    };

    //LISTAR EVENTO
    const listar_EVENTO = async (req, res) => {
        try {
            const { page = 1, limite = 12 } = req.query;

            const query = await app.db
                .select("*")
                .table("rh_evento")
                .limit(limite)
                .offset((page - 1) * limite);

            const [count] = await app.db("rh_evento").count();
            const totalPage = Math.ceil(count["count(*)"] / limite);
            const pageAtual = parseInt(page);

            res.json({
                Total: count["count(*)"],
                Paginas: totalPage,
                PaginaAtual: pageAtual,
                Evento: query,
            });
        } catch (error) {
            res.json({
                mensagem: "Verifique, ocorreu erro ao EVENTO os dados",
                motivo: error,
            });
        }
    };

    //LISTAR HORARIO DE TRABALHO
    const listar_HORARIO_TRABALHO = async (req, res) => {
        try {
            const { page = 1, limite = 12 } = req.query;

            const query = await app.db
                .select("*")
                .table("rh_horario_trabalho")
                .limit(limite)
                .offset((page - 1) * limite);

            const [count] = await app.db("rh_horario_trabalho").count();
            const totalPage = Math.ceil(count["count(*)"] / limite);
            const pageAtual = parseInt(page);

            res.json({
                Total: count["count(*)"],
                Paginas: totalPage,
                PaginaAtual: pageAtual,
                Horario: query,
            });
        } catch (error) {
            res.json({
                mensagem: "Verifique, ocorreu erro ao EVENTO os dados",
                motivo: error,
            });
        }
    };
    //LISTAR FUNCAO
    const listar_FUNCAO = async (req, res) => {
        try {
            const { page = 1, limite = 12 } = req.query;

            const query = await app.db
                .select("*")
                .table("rh_funcao")
                .limit(limite)
                .offset((page - 1) * limite);

            const [count] = await app.db("rh_funcao").count();
            const totalPage = Math.ceil(count["count(*)"] / limite);
            const pageAtual = parseInt(page);

            res.json({
                Total: count["count(*)"],
                Paginas: totalPage,
                PaginaAtual: pageAtual,
                Funcao: query,
            });
        } catch (error) {
            res.json({
                mensagem: "Verifique, ocorreu erro ao EVENTO os dados",
                motivo: error,
            });
        }
    };

    //LISTAR FUNCAO
    const listar_DEPARTAMENTO = async (req, res) => {
        try {
            const { page = 1, limite = 12 } = req.query;

            const query = await app.db
                .select("*")
                .table("rh_departamento")
                .limit(limite)
                .offset((page - 1) * limite);

            const [count] = await app.db("rh_departamento").count();
            const totalPage = Math.ceil(count["count(*)"] / limite);
            const pageAtual = parseInt(page);

            res.json({
                Total: count["count(*)"],
                Paginas: totalPage,
                PaginaAtual: pageAtual,
                Departamento: query,
            });
        } catch (error) {
            res.json({
                mensagem: "Verifique, ocorreu erro ao EVENTO os dados",
                motivo: error,
            });
        }
    };

    //LISTAR COLABORADOR
    const listar_COLABORADOR = async (req, res) => {
        try {
            const { page = 1, limite = 12 } = req.query;

            const query = await app.db
                .select("*")
                .table("colaborador")
                .limit(limite)
                .offset((page - 1) * limite);

            const [count] = await app.db("colaborador").count();
            const totalPage = Math.ceil(count["count(*)"] / limite);
            const pageAtual = parseInt(page);

            res.json({
                Total: count["count(*)"],
                Paginas: totalPage,
                PaginaAtual: pageAtual,
                Colaborador: query,
            });
        } catch (error) {
            res.json({
                mensagem: "Verifique, ocorreu erro ao COLABORADOR os dados",
                motivo: error,
            });
        }
    };

    //LISTAR CNAE

    return {
        cadastrar_EVENTO,
        cadastrar_HORARIO_TRABALHO,
        cadastrar_FUNCAO,
        cadastrar_DEPARTAMENTO,
        cadastrar_COLABORADOR,

        listar_EVENTO,
        listar_HORARIO_TRABALHO,
        listar_FUNCAO,
        listar_DEPARTAMENTO,
        listar_COLABORADOR,
    };
};

const groupBy = require('./../funcoes/groupBy.js')
module.exports = (app) => {
    /*Metodo que ira inserir os dados no banco*/
    const cadastrar_MODULO = async (req, res) => {
        try {
            await app.db("modulos").insert(req.body);
            res.status(200).send({
                mensagem: "Sucesso ao cadastrar modulo",
            });
        } catch (error) {
            res.status(500).send({
                mensagem: "Falha ao cadastrar modulo",
            });
        }
    };

    const cadastrar_PROGRAMAS = async (req, res) => {
        try {
            await app.db("programas").insert(req.body);
            res.status(200).send({
                mensagem: "Sucesso ao cadastrar programas",
            });
        } catch (error) {
            res.status(500).send({
                mensagem: "Falha ao cadastrar programas",
            });
        }
    };

    const cadastrar_SUBPROGRAMA = async (req, res) => {
        try {
            await app.db("programa_SubModulo").insert(req.body);
            res.status(200).send({
                mensagem: "Sucesso ao cadastrar Sub Programa",
            });
        } catch (error) {
            res.status(500).send({
                mensagem: "Falha ao cadastrar Sub Programa",
            });
        }
    };

    const atualizar = (req, res) => {
        const email = req.params.id;
        const { login, senha, perfilId, status } = req.body;

        if (
            login === undefined ||
            login === null ||
            login === "" ||
            perfilId === "" ||
            perfilId === null
        ) {
            return res.status(500).send("Atenção: Campo LOGIN não informado.");
        }

        if (senha === undefined || senha === null || senha === "") {
            app.db("usuarios")
                .where({ email: email })
                .update({ login })
                .then((_) => {
                    res.status(200).send("Sucesso.");
                })
                .catch((err) => {
                    res.status(400).json({
                        mensagem: "Verifique as informações. ",
                        motivo: err.sqlMessage,
                    });
                });
        } else {
            obterHash(req.body.senha, (hash) => {
                const senha = hash;
                app.db("usuarios")
                    .where({ email: email })
                    .update({
                        login,
                        senha,
                        perfilId,
                        status,
                    })
                    .then((_) => {
                        res.status(200).send("Sucesso.");
                    })
                    .catch((err) => {
                        res.status(400).json({
                            mensagem: "Verifique as informações. ",
                            motivo: err.sqlMessage,
                        });
                    });
            });
        }
    };


    const listar_MODULOS = async (req, res) => {
        try {
            const { page = 1 } = req.query;
            const limite = 10;
            const query = await app.db
                .select("*")
                .table("modulos")
                .limit(10)
                .offset((page - 1) * limite);

            const [count] = await app.db("modulos").count();
            const totalPage = Math.ceil(count["count(*)"] / limite);
            const pageAtual = parseInt(page);

            res.json({
                Total: count["count(*)"],
                Paginas: totalPage,
                PaginaAtual: pageAtual,
                Modulos: query,
            });
        } catch (error) {
            res.json({
                mensagem: "Verifique, ocorreu erro ao listar os dados",
                motivo: error,
            });
        }
    };

    const listar_SUBPROGRAMA = async (req, res) => {
        try {
            const { page = 1 } = req.query;
            const limite = 10;
            const query = await app.db
                .select("*")
                .table("programa_SubModulo")
                .limit(10)
                .offset((page - 1) * limite);

            const [count] = await app.db("programa_SubModulo").count();
            const totalPage = Math.ceil(count["count(*)"] / limite);
            const pageAtual = parseInt(page);

            res.json({
                Total: count["count(*)"],
                Paginas: totalPage,
                PaginaAtual: pageAtual,
                SubModulo: query,
            });
        } catch (error) {
            res.json({
                mensagem: "Verifique, ocorreu erro ao listar os dados",
                motivo: error,
            });
        }
    };

    const listar_PROGRAMAS = async (req, res) => {
        try {
            const programa = await app.db
                .select(
                    "programas.nome as Programas",
                    "programas.path",
                    "programa_SubModulo.nome as SubPrograma",
                    "modulos.nome as Modulos",
                )
                .table("programas")
                .join(
                    "programa_SubModulo",
                    "programa_SubModulo.id",
                    "=",
                    "programaSubModuloId",
                )
                .join(
                    "modulos",
                    "modulos.id",
                    "=",
                    "programa_SubModulo.moduloId",
                );




            const agrupamento = groupBy(programa, "Modulos");




            res.json(agrupamento);
        } catch (error) {
            res.json({
                mensagem: "Verifique, ocorreu erro ao listar os dados",
                motivo: error,
            });
        }
    };

    return {
        cadastrar_MODULO,
        cadastrar_PROGRAMAS,
        cadastrar_SUBPROGRAMA,
        listar_PROGRAMAS,
        listar_MODULOS,
        listar_SUBPROGRAMA
    };
};

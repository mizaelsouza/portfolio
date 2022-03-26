const bccrypt = require("bcrypt-nodejs");

module.exports = (app) => {
    /*Metodo que ira inserir os dados no banco*/
    const save = (req, res) => {
        obterHash(req.body.senha, (hash) => {
            const { login, email, perfilId, status } = req.body;
            const senha = hash;
            app.db("usuarios")
                .insert({
                    login,
                    senha,
                    email: email.toLowerCase(),
                    perfilId,
                    status,
                })
                .then((_) => res.status(200).send("Sucesso."))
                .catch((err) => {
                    if (err.code === "ER_DUP_ENTRY") {
                        res.status(400).json({
                            status: 400,
                            mensagem: "Usuario já esta cadastro.",
                            "motivo:": err.sqlMessage,
                        });
                    } else {
                        res.status(500).json({
                            status: 500,
                            mensagem: "Verifique os dados: ",
                            err,
                        });
                    }
                });
        });
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

    const listarPorEmail = (req, res) => {
        const email = req.params.id;
        app.db
            .select(
                "usuarios.id as id",
                "login",
                "email",
                "perfilUsuario.nome as perfil",
                "usuarios.status as status",
            )
            .table("usuarios")
            .join("perfilUsuario", "usuarios.perfilId", "=", "perfilUsuario.id")
            .where({ email: email })
            .then((user) => {
                res.send(user);
            })
            .catch((err) => {
                res.status(400).send("Verifique as informações. ");
            });
    };

    const listar = async (req, res) => {
        try {
            const { page = 1 } = req.query;
            const limite = 10;
            const query = await app.db
                .select(
                    "usuarios.id as id",
                    "login",
                    "email",
                    "perfilUsuario.nome as perfil",
                    "usuarios.status as status",
                )
                .table("usuarios")
                .join(
                    "perfilUsuario",
                    "usuarios.perfilId",
                    "=",
                    "perfilUsuario.id",
                )
                .orderBy("usuarios.id")
                .limit(10)
                .offset((page - 1) * limite);

            const [count] = await app.db("usuarios").count();
            const totalPage = Math.ceil(count["count(*)"] / limite);
            const pageAtual = parseInt(page);

            res.json({
                Total: count["count(*)"],
                Paginas: totalPage,
                PaginaAtual: pageAtual,
                Usuarios: query,
            });
        } catch (error) {
            res.json({
                mensagem: "Verifique, ocorreu erro ao listar os dados",
                motivo: error,
            });
        }
    };

    const listarModulo = async (req, res) => {
        try {
            const modulo = await app.db.select("*").table("programa_modulo");

            const subModulo = await app.db
                .select(
                    "programa_modulo.nome as modulo",
                    "programa_submodulo.nome as menu",
                )
                .table("programa_submodulo")
                .join(
                    "programa_modulo",
                    "programaModuloId",
                    "=",
                    "programa_modulo.id",
                );
            const programa = await app.db
                .select(
                    "programa.nome as programa",
                    "programa.path",
                    "programa_submodulo.nome as menu",
                )
                .table("programa")
                .join(
                    "programa_submodulo",
                    "programaSubModuloId",
                    "=",
                    "programa_submodulo.id",
                );

            res.json(
                { modulo, subModulo, programa },
                //{ programa },
            );
        } catch (error) {
            res.json({
                mensagem: "Verifique, ocorreu erro ao listar os dados",
                motivo: error,
            });
        }
    };

    return { listarModulo };
};

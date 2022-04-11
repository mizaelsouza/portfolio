const bccrypt = require("bcrypt-nodejs");

module.exports = (app) => {
    const obterHash = (password, callback) => {
        bccrypt.genSalt(10, (err, salt) => {
            bccrypt.hash(password, salt, null, (err, hash) => callback(hash));
        });
    };

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
                    }

                    if (err.code === "ER_NO_REFERENCED_ROW_2") {
                        res.status(500).json({
                            status: 500,
                            mensagem:
                                "Perfil não encontrado ou tabela PERFIL_USUARIO vazia.",
                        });
                    } else {
                        res.status(500).json({
                            status: 500,
                            mensagem: "Verifique os erros abaixo.",
                            err,
                        });
                    }
                });
        });
    };

    /*Metodo que ira inserir os dados no banco*/
    const cadastrar_perfil = (req, res) => {
        const { nome, status } = req.body;

        app.db("perfil_usuarios")
            .insert({
                nome,
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
    };

    /*Metodo que ira inserir os dados no banco*/
    const cadastrar_Perfil_USUARIOS_PROGRAMA = (req, res) => {

        app.db("perfil_usuarios_programas")
            .insert(req.body)
            .then((_) => res.status(200).send("Sucesso."))
            .catch((err) => {
                if (err.code === "ER_DUP_ENTRY") {
                    res.status(400).json({
                        status: 400,
                        mensagem: "Perfil do Programa já esta cadastro.",
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
    };


    const cadastrar_USUARIOS_PROGRAMA = (req, res) => {

        app.db("usuario_programas")
            .insert(req.body)
            .then((_) => res.status(200).send("Sucesso."))
            .catch((err) => {
                if (err.code === "ER_DUP_ENTRY") {
                    res.status(400).json({
                        status: 400,
                        mensagem: "Usuario do Programa já esta cadastro.",
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
                "perfil_usuarios.nome as perfil",
                "usuarios.status as status",
            )
            .table("usuarios")
            .join(
                "perfil_usuarios",
                "usuarios.perfilId",
                "=",
                "perfil_usuarios.id",
            )
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
                    "perfil_usuarios.nome as perfil",
                    "usuarios.status as status",
                )
                .table("usuarios")
                .join(
                    "perfil_usuarios",
                    "usuarios.perfilId",
                    "=",
                    "perfil_usuarios.id",
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



    const listarPerfil = async (req, res) => {
        try {
            const { page = 1 } = req.query;
            const limite = 10;
            const query = await app.db
                .select("*")
                .table("perfil_usuarios")
                .limit(10)
                .offset((page - 1) * limite);

            const [count] = await app.db("perfil_usuarios").count();
            const totalPage = Math.ceil(count["count(*)"] / limite);
            const pageAtual = parseInt(page);

            res.json({
                Total: count["count(*)"],
                Paginas: totalPage,
                PaginaAtual: pageAtual,
                Perfil: query,
            });
        } catch (error) {
            res.json({
                mensagem: "Verifique, ocorreu erro ao listar os dados",
                motivo: error,
            });
        }
    };




    const listar_Perfil_USUARIOS_PROGRAMA = async (req, res) => {
        try {
            const result = await app.db.select("*").table("perfil_usuarios_programas")
            res.json(result);

        } catch (error) {
            res.json({
                mensagem: "Verifique, ocorreu erro ao listar os dados",
                motivo: error,
            });
        }
    };


    const listar_USUARIOS_PROGRAMA = async (req, res) => {
        try {
            const result = await app.db.select("usuario_programas.id","login as usuario","nome as programa").table("usuario_programas")
            .join('usuarios','usuarios.id','usuarioId')
            .join('programas','programas.id','programaId')
            res.json(result);

        } catch (error) {
            res.json({
                mensagem: "Verifique, ocorreu erro ao listar os dados",
                motivo: error,
            });
        }
    };


    const atualizar_Perfil_USUARIOS_PROGRAMA = async (req, res) => {
        try {
            const id = req.params.id
            await app.db("perfil_usuarios_programas").update(req.body).where({ id: id });
            res.status(200).send('Dados Atualizados.')

        } catch (error) {
            res.status(500).send({ ERRO: 'Falha ao atualizar os DADOS.', error })
        }
    };

    const deletar_Perfil_USUARIOS_PROGRAMA = async (req, res) => {
        try {
            const id = req.params.id
            await app.db("perfil_usuarios_programas").delete().where({ id: id });
            res.status(200).send('Dados deletar com sucesso.')

        } catch (error) {
            res.status(500).send({ ERRO: 'Falha ao deletar os DADOS.', error })
        }
    };

    return {
        save,
        cadastrar_perfil,
        cadastrar_Perfil_USUARIOS_PROGRAMA,
        cadastrar_USUARIOS_PROGRAMA,
        listar,
        listarPerfil,
        listarPorEmail,
        listar_Perfil_USUARIOS_PROGRAMA,
        listar_USUARIOS_PROGRAMA,
        atualizar,
        atualizar_Perfil_USUARIOS_PROGRAMA,
        deletar_Perfil_USUARIOS_PROGRAMA
    };
};

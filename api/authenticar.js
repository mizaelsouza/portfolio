const jwt = require("jwt-simple");
const bccrypt = require("bcrypt-nodejs");
const crypto = require("crypto");
const moment = require("moment");

const mail = require("../config/modulo/mail");

module.exports = (app) => {
    const obterHash = (password, callback) => {
        bccrypt.genSalt(10, (err, salt) => {
            bccrypt.hash(password, salt, null, (err, hash) => callback(hash));
        });
    };

    const login = async (req, res) => {
        if (!req.body.email || !req.body.senha) {
            return res.status(400).send("E-mail ou senha invalido. Verifique!");
        }

        const usuario = await app.db
            .select(
                "usuarios.id as id",
                "login",
                app.db.raw(
                    "CAST(senha AS CHAR(1000) CHARACTER SET utf8) as senha",
                ),
                "email",
                "perfil_usuarios.nome as perfil",
                "usuarios.status as status",
            )
            .table("usuarios")
            .join("perfil_usuarios", "usuarios.perfilId", "=", "perfil_usuarios.id")
            .whereRaw("LOWER(email)= LOWER(?)", req.body.email)
            .first();

        if (usuario) {
            bccrypt.compare(
                String(Number(req.body.senha)),
                usuario.senha,
                (err, isMatch) => {
                    try {
                        if (err || !isMatch) {
                            return res
                                .status(401)
                                .send("Usuario não esta AUTORIZADO.");
                        }
                        const payload = { id: usuario.id };

                        res.json({
                            login: usuario.login,
                            email: usuario.email,
                            perfil: usuario.perfil,
                            status: usuario.status,
                            token: jwt.encode(
                                payload,
                                `${process.env.AUTH_SECRET}`,
                            ),
                        });
                    } catch (error) {
                        return res.status(500).json({
                            mensagem: "Ocorreu um erro, verifique.",
                            motivo: error,
                        });
                    }
                },
            );
        } else {
            return res.status(401).send("Usuario não esta AUTORIZADO.");
        }
    };

    const recuperarsenha = async (req, res) => {
        const { email } = req.body;

        try {
            const usuario = await app.db("usuarios").where({ email });

            if (usuario.length <= 0)
                return res.status(404).send({
                    error: "Email - Não esta cadastrado na base de dados.",
                });

            if (!usuario)
                return res
                    .status(404)
                    .send({ error: "Email - não encontrado." });

            const token = crypto.randomBytes(20).toString("hex");

            const dataExpiracao = new Date();

            const dtExp = moment(
                dataExpiracao.setHours(dataExpiracao.getHours() + 1),
            ).format();

            await app
                .db("usuarios")
                .where({ email })
                .update({ pwdresettoken: token, dtExpiracaoToken: dtExp });

            mail.sendMail(
                {
                    to: email,
                    from: "mizaelsouza31@gmail.com",
                    template: "/resetSenha",
                    context: { token },
                },
                (err) => {
                    if (err)
                        return res.status(400).send({
                            error: "Ocorreu um erro ao envair e-mail.",
                        });
                    return res.send();
                },
            );
        } catch (error) {
            res.status(400).send({
                error: "Erro ao recuperar a senha, verifique.",
            });
        }
    };

    const altarecaoSenha = async (req, res) => {
        const { email, token, novasenha } = req.body;

        try {
            const usuario = await app.db
                .select("email", "pwdresettoken", "dtExpiracaoToken")
                .from("usuarios")
                .where({ email });

            if (
                novasenha === undefined ||
                novasenha === null ||
                novasenha === ""
            )
                return res
                    .status(400)
                    .send({ error: "Nova Senha não informada." });

            if (token === undefined || token === null || token === "")
                return res.status(400).send({ error: "Token não informado" });

            if (usuario.length <= 0)
                return res
                    .status(400)
                    .send({ error: "E-mail não localizado." });

            usuario.map((usuario) => {
                if (token !== usuario.pwdresettoken)
                    return res
                        .status(400)
                        .send({ error: "Tokén não confere." });

                if (email !== usuario.email)
                    return res.status(400).send({ error: "E-mail invalido." });

                const dataAgora = new Date();
                const dtAgora = moment(
                    dataAgora.setHours(dataAgora.getHours()),
                ).format();

                const dtValidadeToken = moment(
                    usuario.dtExpiracaoToken,
                ).format();

                if (dtAgora > dtValidadeToken)
                    return res
                        .status(400)
                        .send({ error: "Validade do tokén expirada." });

                obterHash(novasenha, (hash) => {
                    const senha = hash;
                    app.db("usuarios")
                        .where({ email: email })
                        .update({ senha })
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
            });
        } catch (error) {
            console.log(error);
            res.status(400).send({
                error: "Erro ao recuperar a senha, verifique.",
            });
        }
    };

    return { login, recuperarsenha, altarecaoSenha };
};

const groupBy = require('../funcoes/groupBy.js')
module.exports = (app) => {
    /*Metodo que ira inserir os dados no banco*/
    const cadastrar_PREVILEGIO = async (req, res) => {
        try {
            await app.db("previlegios").insert(req.body);
            res.status(200).send({
                mensagem: "Sucesso ao cadastrar PREVILEGIO",
            });
        } catch (error) {
            res.status(500).send({
                mensagem: "Falha ao cadastrar PREVILEGIO",
            });
        }
    };

    const cadastrar_PREVILEGIO_PROGRAMAS = async (req, res) => {
        try {
            await app.db("programas_previlegios").insert(req.body);
            res.status(200).send({
                mensagem: "Sucesso ao cadastrar PREVILEGIO",
            });
        } catch (error) {
            res.status(500).send({
                mensagem: "Falha ao cadastrar PREVILEGIO",
            });
        }
    };


    const cadastrar_USUARIOS_PROGRAMA_PREVILEGIO = async (req, res) => {
        try {
            await app.db("usuarios_programas_previlegios").insert(req.body);
            res.status(200).send({
                mensagem: "Sucesso ao cadastrar PREVILEGIO",
            });
        } catch (error) {
            res.status(500).send({
                mensagem: "Falha ao cadastrar PREVILEGIO",
            });
        }
    };

    //LISTA

    const listar_PREVILEGIOS = async (req, res) => {
        try {
            const result = await app.db.select('*').table('previlegios')
            res.json(result)
        } catch (error) {
            res.json({ ERRO: 'Falha ao listar os DADOS.' })
        }
    }

    const listar_USUARIOS_PROGRAMA_PREVILEGIO = async (req, res) => {
        try {
            const result = await app.db.select('*').table('usuarios_programas_previlegios')
            res.json(result)
        } catch (error) {
            res.json({ ERRO: 'Falha ao listar os DADOS.' })
        }
    }

    const listar_PREVILEGIO_PROGRAMAS = async (req, res) => {
        try {
            const result = await app.db.select('*').table('programas_previlegios')
                .join('usuarios', 'usuarios.id', 'usuarioId')
            res.json(result)
        } catch (error) {
            res.json({ ERRO: 'Falha ao listar os DADOS.' })
        }
    }


    //ATUALIZAR REGISTRO


    const atualizar_PREVILEGIOS = async (req, res) => {
        try {
            const id = req.params.id
            const result = await app.db('previlegios').update(req.body).where({ id: id })
            if (result > 0) {
                return res.status(200).send('Dados Atualizados.')
            }
            if (result <= 0) {
                return res.status(200).send('Dados não atualizados, verifique o ID')
            }

        } catch (error) {
            res.status(500).send({ ERRO: 'Falha ao atualizar os DADOS.', error })
        }
    };



    const atualizar_PREVILEGIO_PROGRAMAS = async (req, res) => {
        try {
            const id = req.params.id
            const result = await app.db("programas_previlegios").update(req.body).where({ id: id });

            if (result > 0) {
                return res.status(200).send('Dados Atualizados.')
            }
            if (result <= 0) {
                return res.status(200).send('Dados não atualizados, verifique o ID')
            }

        } catch (error) {
            res.status(500).send({ ERRO: 'Falha ao atualizar os DADOS.', error })
        }
    };

    const atualizar_USUARIOS_PROGRAMA_PREVILEGIO = async (req, res) => {
        try {
            const id = req.params.id
            const result = await app.db("usuarios_programas_previlegios").update(req.body).where({ id: id });

            if (result > 0) {
                return res.status(200).send('Dados Atualizados.')
            }

            if (result <= 0) {
                return res.status(200).send('Dados não atualizados, verifique o ID')
            }

        } catch (error) {
            res.status(500).send({ ERRO: 'Falha ao atualizar os DADOS.', error })
        }
    };

    //DELETAR REGISTRO
    const deletar_PREVILEGIOS = async (req, res) => {
        try {
            const id = req.params.id
            const result = await app.db('previlegios').del().where({ id: id })

            if (result > 0) {
                return res.status(200).send('Dados Deletados.')
            }
            if (result <= 0) {
                return res.status(200).send('Dados não deletado, verifique o ID')
            }

        } catch (error) {
            res.json({ ERRO: 'Falha ao deletado os DADOS.', error })
        }
    };

    const deletar_PREVILEGIO_PROGRAMAS = async (req, res) => {
        try {
            const id = req.params.id
            const result = await app.db("programas_previlegios").del().where({ id: id })

            if (result > 0) {
                return res.status(200).send('Dados Deletados.')
            }
            if (result <= 0) {
                return res.status(200).send('Dados não deletado, verifique o ID')
            }

        } catch (error) {
            res.json({ ERRO: 'Falha ao deletar os DADOS.', error })
        }
    };

    const deletar_USUARIOS_PROGRAMA_PREVILEGIO = async (req, res) => {
        try {
            const id = req.params.id
            const result = await app.db("usuarios_programas_previlegios").del().where({ id: id })

            if (result > 0) {
                return res.status(200).send('Dados Deletados.')
            }
            if (result <= 0) {
                return res.status(200).send('Dados não deletado, verifique o ID')
            }

        } catch (error) {
            res.json({ ERRO: 'Falha ao deletar os DADOS.', error })
        }
    };





    return {
        cadastrar_PREVILEGIO,
        cadastrar_PREVILEGIO_PROGRAMAS,
        cadastrar_USUARIOS_PROGRAMA_PREVILEGIO,

        listar_PREVILEGIOS,
        listar_USUARIOS_PROGRAMA_PREVILEGIO,
        listar_PREVILEGIO_PROGRAMAS,

        atualizar_PREVILEGIOS,
        atualizar_PREVILEGIO_PROGRAMAS,
        atualizar_USUARIOS_PROGRAMA_PREVILEGIO,

        deletar_PREVILEGIOS,
        deletar_PREVILEGIO_PROGRAMAS,
        deletar_USUARIOS_PROGRAMA_PREVILEGIO
    };
};

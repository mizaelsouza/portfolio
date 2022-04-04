module.exports = (app) => {
    //CADASTRO DE LOJA
    const cadastrar_LOJA = async (req, res) => {
        try {
            const {
                razaoSocial,
                nomeFantasia,
                cnpj,
                im,
                iest,
                site,
                crtId,
                cnaeId,
                cep,
                logradouro,
                numero,
                bairro,
                complemento,
                municipioId,
                ufId,
                telefone,
                celular,
                email,
                status,
            } = req.body;

            const pessoa = {
                nome: razaoSocial,
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
                const loja = {
                    nomeFantasia,
                    cnpj,
                    im,
                    iest,
                    site,
                    crtId,
                    cnaeId,
                    pessoasId: resultPessoa[0],
                    status,
                };

                const contatos = {
                    telefone,
                    celular,
                    email,
                    site,
                    pessoasId: resultPessoa[0],
                };

                if (resultPessoa[0] > 0) {
                    const resultLoja = await app
                        .db("loja")
                        .transacting(trans)
                        .insert(loja);

                    const resultContatos = await app
                        .db("contatos")
                        .transacting(trans)
                        .insert(contatos);

                    if (resultLoja[0] > 0 && resultContatos[0] > 0) {
                        res.status(200).send({
                            sucesso: "LOJA cadastrada com sucesso.",
                        });
                    }
                }
            });
        } catch (err) {
            res.status(500).send({
                error: "FALHA ao cadsatrar LOJA.",
                motivo: err,
            });
        }
    };

    const listar_LOJA = async (req, res) => {
        const result = await app.db
            .select(
                "loja.id as codigo",
                "pessoas.id as pessoasId",
                "pessoas.nome as razaoSocial",
                "loja.nomeFantasia",
                "loja.cnpj",
                "loja.iest",
                "loja.im",
                "contatos.telefone",
                "contatos.celular",
                "contatos.email",
                "contatos.site",

                "pessoas.cep",
                "pessoas.logradouro",
                "pessoas.numero",
                "pessoas.complemento",
                "pessoas.bairro",
                "municipio.nome as cidade",
                "uf.sigla as uf"
            )
            .table("loja")
            .join("pessoas", "pessoas.id", "pessoasId")
            .join("contatos", "contatos.pessoasId", "pessoas.id")
            .join("municipio", "municipio.id", "pessoas.municipioId")
            .join("uf", "uf.id", "pessoas.ufId");


        res.json({
            loja: result,
        });
    };


    const atualizar_LOJA = async (req, res) => {
        try {
            const id = req.params.id

            const {
                razaoSocial,
                nomeFantasia,
                cnpj,
                im,
                iest,
                site,
                crtId,
                cnaeId,
                cep,
                logradouro,
                numero,
                bairro,
                complemento,
                municipioId,
                ufId,
                telefone,
                celular,
                email,
                status,
            } = req.body;

            const pessoa = {
                nome: razaoSocial,
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
                    .where({ 'pessoas.id': id })
                    .update(pessoa);

                if (resultPessoa <= 0) {
                    return res.status(500).send({ error: 'Informação não localizada.' })
                }


                const loja = {
                    nomeFantasia,
                    cnpj,
                    im,
                    iest,
                    site,
                    crtId,
                    cnaeId,
                    status
                };

                const contatos = {
                    telefone,
                    celular,
                    email,
                    site
                };

                if (resultPessoa > 0) {
                    const resultLoja = await app
                        .db("loja")
                        .transacting(trans)
                        .where({ pessoasId: id })
                        .update(loja);


                    const resultContatos = await app
                        .db("contatos")
                        .transacting(trans)
                        .where({ pessoasId: id })
                        .update(contatos);


                    if (resultLoja > 0 && resultContatos > 0) {
                        res.status(200).send({
                            sucesso: "LOJA atualizada com sucesso.",
                        });
                    }
                }
            });
        } catch (err) {
            res.status(500).send({
                error: "FALHA ao cadsatrar LOJA.",
                motivo: err,
            });
        }
    };


    const filtro_COLABORADOR = async (req, res) => {
        const id = req.params.id
        const result = await app.db.select(
            "loja.id as codigo",
            "pessoas.nome as razaoSocial",
            "loja.nomeFantasia",
            "loja.cnpj",
            "loja.iest",
            "loja.im",
            "contatos.telefone",
            "contatos.celular",
            "contatos.email",
            "contatos.site",

            "pessoas.bairro",
            "pessoas.logradouro",
            "pessoas.numero",
            "pessoas.complemento",
        ).table('loja')
            .join("pessoas", "pessoas.id", "pessoasId")
            .join("contatos", "contatos.pessoasId", "pessoas.id")
            .where({ 'cnpj': id })

    res.json(result)

}

//LISTAR REGIME TRIBUTARIO

return {
    cadastrar_LOJA,
    listar_LOJA,
    atualizar_LOJA,
    filtro_COLABORADOR
};
};

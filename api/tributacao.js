module.exports = (app) => {
    //CODIGO REGIME TRIBUTARIO
    const cadastrar_CRT = (req, res) => {
        app.db("regime_tributario")
            .insert(req.body)
            .then((_) => {
                res.status(200).send({
                    sucesso: "CRT registrado com sucesso.",
                });
            })
            .catch((err) => {
                res.status(200).send({
                    error: "FALHA ao registrado CRT.",
                    err,
                });
            });
    };

    //LISTAR REGIME TRIBUTARIO
    const listar_CRT = async (req, res) => {
        try {
           const result = await app.db.select("*").table('regime_tributario')
           res.json(result)
        } catch (error) {
            res.status(500).send({error: 'ERROR: falha ao listar regime de tributação.'})
        }
    }



//CODIGO CNAE
const cadastrar_CNAE = (req, res) => {
    app.db("cnae_fiscal")
        .insert(req.body)
        .then((_) => {
            res.status(200).send({
                sucesso: "CNAE registrado com sucesso.",
            });
        })
        .catch((err) => {
            res.status(200).send({
                error: "FALHA ao registrado CNAE.",
                err,
            });
        });
};

//LISTAR CNAE
const listar_CNAE = async (req, res) => {
    try {
        const result = await app.db.select("*").table('cnae_fiscal')
        res.json(result)
     } catch (error) {
         res.status(500).send({error: 'ERROR: falha ao listar CNAE.'})
     }
 };

return {
    cadastrar_CRT,
    cadastrar_CNAE,
    listar_CRT,
    listar_CNAE,
};
};

const express = require("express");
const cors = require("cors");
const path = require("path");
const sweggerUi = require("swagger-ui-express");
const sweggerDocs = require("../docs/sweggerDocs.json");

module.exports = (app) => {
    app.use(express.json());
    app.use('/api/docs', sweggerUi.serve, sweggerUi.setup(sweggerDocs))
    app.use(express.urlencoded({ extended: true, limit: "50mb" }));
    app.use(
        "/fotos",
        express.static(path.resolve(__dirname, "..", "temp", "upload")),
    );

    app.use(
        cors({
            origin: "*",
        }),
    );
};

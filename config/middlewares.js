const express = require("express");
const cors = require("cors");
const path = require("path");

module.exports = (app) => {
    app.use(express.json());
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

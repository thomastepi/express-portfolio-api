const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        type: { type: String, default: "" },
        comment: { type: String, required: true },
    },
    { collection: "portfolio"},
    { timestamps: true }
    );

const PortfolioModel = mongoose.model("Portfolio", portfolioSchema);

module.exports = PortfolioModel;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/buscar", async (req, res) => {
    const nombre = req.query.tanque?.toLowerCase().trim();
    if (!nombre) return res.json({ error: "Nombre requerido" });

    try {
        const response = await axios.get("https://wotconsole.info/marks/");
        const $ = cheerio.load(response.data);

        let resultado = null;

        $("tbody tr").each((i, el) => {
            const nombreTanque = $(el).find("td:nth-child(5) span").text().trim();

            if (nombreTanque.toLowerCase().includes(nombre)) {
                const marcas = $(el).find("td.mark");

                resultado = {
                    tanque: nombreTanque,
                    tier: $(el).find("td:nth-child(3)").text().trim(),
                    tipo: $(el).find("td:nth-child(2)").text().trim(),
                    marca1: $(marcas[0]).text().trim(),
                    marca2: $(marcas[1]).text().trim(),
                    marca3: $(marcas[2]).text().trim(),
                    marca4: $(marcas[3]).text().trim(),
                };
            }
        });

        if (!resultado) return res.json({ error: "No encontrado" });

        res.json(resultado);

    } catch (err) {
        res.json({ error: "Error al obtener datos" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor corriendo"));

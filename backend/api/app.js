const mysql = require("mysql2");
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000; 

app.use(express.json());
app.use(cors());

// Configuração da conexão banco de dados
const connection = mysql.createConnection({
  host: "tramway.proxy.rlwy.net",
  user: "root",
  password: "eqTjlqifWCsVEarOiRfpLAziWMFrRKHv",
  database: "card",
  port: 15645
});

// Conectar ao banco de dados
connection.connect((error) => {
  if (error) {
    console.error("Erro ao conectar:", error.stack);
    return;
  }
  // CREATE - Inserir cartão
  app.post("/cards", (req, res) => {
    const cardData = req.body;
    const query = "INSERT INTO numbercard SET ?";

    connection.query(query, cardData, (error, results) => {
      if (error) {
        console.error("Erro ao inserir o cartão:", error.message);
        return res.status(500).json({ error: "Erro ao inserir o cartão" });
      }
      res.status(201).json({
        id: results.insertId,
        message: "Cartão inserido com sucesso!",
      });
    });
  });

  // READ - Consultar todos os cartões
  app.get("/cards", (req, res) => {
    const query = "SELECT * FROM numbercard";
    connection.query(query, (error, results) => {
      if (error) {
        console.error("Erro ao consultar cartões:", error.message);
        return res.status(500).json({ error: "Erro ao consultar cartões!" });
      }
      res.status(200).json(results);
    });
  });

  // READ - Consultar cartão por ID
  app.get("/cards/:id", (req, res) => {
    const cardId = req.params.id;
    console.log(`Buscando cartão com ID: ${cardId}`);
    const query = "SELECT * FROM numbercard WHERE idNumber = ?";
    connection.query(query, [cardId], (error, results) => {
      if (error) {
        console.error("Erro ao buscar o cartão:", error.message);
        return res.status(500).json({ error: "Erro ao buscar o cartão" });
      }
      if (results.length === 0) {
        console.log("Cartão não encontrado");
        return res.status(404).json({ error: "Cartão não encontrado" });
      }
      console.log("Cartão encontrado:", results[0]);
      res.status(200).json(results[0]);
    });
  });

  // UPDATE - Atualizar cartão
  app.put("/cards/:id", (req, res) => {
    const cardId = req.params.id;
    const newCardData = req.body;
    const query = "UPDATE numbercard SET ? WHERE idNumber = ?";

    connection.query(query, [newCardData, cardId], (error, results) => {
      if (error) {
        console.error("Erro ao atualizar o cartão:", error.message);
        return res.status(500).json({ error: "Erro ao atualizar o cartão", details: error.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Cartão não encontrado" });
      }
      res.status(200).json({
        message: "Cartão atualizado com sucesso",
        affectedRows: results.affectedRows,
      });
    });
  });

  // DELETE - Deletar cartão
  app.delete("/cards/:id", (req, res) => {
    const cardId = req.params.id;
    console.log(`Tentando deletar cartão com ID: ${cardId}`);
    const query = "DELETE FROM numbercard WHERE idNumber = ?";
    connection.query(query, [cardId], (error, results) => {
      if (error) {
        console.error("Erro ao deletar o cartão:", error.message);
        return res.status(500).json({ error: 'Erro ao deletar o cartão' });
      }
      if (results.affectedRows === 0) {
        console.log("Cartão não encontrado");
        return res.status(404).json({ error: 'Cartão não encontrado' });
      }
      console.log("Cartão deletado com sucesso");
      res.status(200).json({ message: 'Cartão deletado com sucesso', affectedRows: results.affectedRows });
    });
  });

  // Iniciar o servidor
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
});

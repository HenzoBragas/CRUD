const mysql = require("mysql");
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000; // Porta do servidor

app.use(express.json());
app.use(cors());

// Configuração da conexão banco de dados
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "admin",
  database: "card",
  port: 3306,
});

// Conectar ao banco de dados
connection.connect((error) => {
  if (error) {
    console.error("Erro ao conectar:", error.stack);
    return;
  }
  console.log("Conectado");

  //CREATE
  // Inserir o usuário
  app.post("/cards", (req, res) => {
    const cardData = req.body; // Obter os dados do cartão do corpo da requisição
    const query = "INSERT INTO numberCard SET ?"; // Verifique se a tabela é 'numberCard'

    // Usar cardData em vez de numberCard
    connection.query(query, cardData, (error, results, fields) => {
      if (error) {
        return res.status(500).json({ error: "Erro ao inserir o cartão" });
      }
      res.status(201).json({
        id: results.insertId,
        message: "Cartão inserido com sucesso!",
      });
    });
  });

  //READ
  // Função consulta
  app.get("/cards", (req, res) => {
    const query = "SELECT * FROM numberCard"; // CONSULTA
    connection.query(query, (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Erro ao consultar cartões!" });
      }
      res.status(200).json(results);
    });
  });

  //Atualizar (Update)
  app.put("/cards/:cardNumber", (req, res) => {
    const cardNumber = req.params.cardNumber;
    const newCardData = req.body;
    const query = "UPDATE numberCard SET ? WHERE cardNumber = ?";
    connection.query(query, [newCardData, cardNumber], (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Erro a atualizar o cartão" });
      }
      res.status(200).json({
        message: "Cartão atualizado com sucesso",
        affectedRows: results.affectedRows,
      });
    });
  });

  //DELETE
  app.delete("/cards/:cardNumber", (req, res) => {
    const cardNumber = req.params.cardNumber;
    const query = "DELETE FROM numberCard WHERE cardNumber = ?";
    connection.query(query, [cardNumber], (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Erro ao deletar o cartão' });
      }
      res.status(200).json({ message: 'Cartão deletado com sucesso', affectedRows: results.affectedRows });
    });
  });

  //Iniciar o servidor
  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
});

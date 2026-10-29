import express from "express";

const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/", (req, res) => {
  res.send("Welcome to the Library API");
});

app.get("api/books", (req,res) =>{
    res.sendStatus(200).send("Welcome in entpoint books!")
});
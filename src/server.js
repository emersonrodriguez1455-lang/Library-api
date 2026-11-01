import express from "express";

const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the API!" });
});

app.get("/libros", (req, res) => {
  res.status(200).json(libros);
});


app.get("/libros/:id",(req,res)=>{
  const id = Number(req.params.id)
  const libro = libros.find((libro) => libro.id === id);

  if(!libro){
    return res.status(404).json({
      message: " 404 Uups something it's wrong"
    });
  }
  res.status(200).json(libro)
});

const libros = [
  {
    id: 1,
    title: "Cien años de soledad",
    status: "available"
  },
  {
    id: 2,
    title: "El principito",
    status: "borrowed"
  }
];

app.post("/registrarLibro", (req,res)=>{

  const {title,status} = req.body;

  if(typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      message:"The title must be a string and cannot be empty"
    });
  }

  const estadosPermitidos=[
    "borrowed",
    "available",
    "maintenance"
  ]

  if(!estadosPermitidos.includes(status)){
    return res.status(400).json({
      message:"The status is invalid; please send the correct one."
    });
  }


  const nuevoId = libros.length>0
  ?Math.max(...libros.map(libro => libro.id))+1
  :1;

  const nuevoLibro = {
    id: nuevoId,
    title: title.trim(),
    status: status

  };

  libros.push(nuevoLibro);
  res.status(201).json(nuevoLibro);


});
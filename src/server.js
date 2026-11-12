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


app.patch("/libros/:id", (req,res)=>{
  const id=Number(req.params.id); //obtenesmos el id del libro
  const libro=libros.find(libro=>libro.id===id); // realizamos la busqueda del libro deseado y lo guardamos en una variable
  
  if(!libro){ //realizamos una sentencia que nos ayuda a preguntarnos si el libro existe
    return res.status(404).json({
      error: "Libro no encontrado"
    });
  }


if(!req.body||typeof req.body !=="object"||Array.isArray(req.body)){
  return res.status(400).json({
    error:"Solicitud incorrecta, debería venir un objeto o no estar vacío"
  });
  //aca validamos que sea un objeto 
}

if(Object.keys(req.body).length===0){
  return res.status(400).json({
    error:"Bad request, el objeto viene vacio!"
  })
}//devuelve un error si el objeto viene vacio


const camposRecibidos= Object.keys(req.body)
const camposPermitidos=["title","status"]
const camposNoPermitidos=camposRecibidos.some(
  campo => !camposPermitidos.includes(campo)
); //le decimos que a los campos recibidos les pregunte si no están en los campos permitidos

if(camposNoPermitidos){
  return res.status(400).json({
    error:"Some properties are not allowed",
    propiedades: `Estos son los campos permitidos ${camposPermitidos}`
  });
}

  if("title" in req.body){

    if(typeof req.body.title!=="string"||req.body.title.trim()===""){
      return res.status(400).json({
        error:"the title must be a string and cannot be empty"
      });
    }
}
  const estadosPermitidos=[
    "borrowed",
    "available",
    "maintenance"
  ];

  if("status" in req.body){
    if(typeof req.body.status!=="string"||req.body.status.trim()===""||
      !estadosPermitidos.includes(req.body.status)){
        return res.status(400).json({
          error:"The state must be a text string; it cannot be empty and must contain one of the permitted values."
        });
    }
  }

    // aplicar cambios solo después de validar todo
  if ("title" in req.body) libro.title = req.body.title.trim();
  if ("status" in req.body) libro.status = req.body.status;

  return res.status(200).json({
    message: "Cambios guardados",
    libro
  });

});

app.put("/libros/:id", (req,res)=>{
  const id=Number(req.params.id);
  const libro=libros.find(libro=>libro.id===id);
  if(!libro){
    return res.status(404).json({
      error:"The book not found"
    });
  }

  if(Array.isArray(req.body)||!req.body||typeof req.body!=="object"){
    return res.status(400).json({
      error:"Bad request, in typeof request, or empty request"
    })
  }

  const camposPermitidos = ["title", "status"];
  const camposRecibidos = Object.keys(req.body);

  const camposInvalidos =
    camposRecibidos.length !== camposPermitidos.length ||
    camposRecibidos.some((campo) => !camposPermitidos.includes(campo));

  if (camposInvalidos) {
    return res.status(400).json({ error: "Send exactly title and status" });
  }



  if(typeof req.body.title!=="string"||req.body.title.trim()===""){
    return res.status(400).json({
      error:"Bad request, the title must be string and cannot be empty"
    });
  } 
  
  const estadosPermitidos=[
    "borrowed",
    "available",
    "maintenance"
  ];

  if(!estadosPermitidos.includes(req.body.status)){
    return res.status(400).json({
      error:"Incorrect request, wrong request type, empty request, or invalid fields"
    });
  }

  libro.status=req.body.status;
  libro.title=req.body.title.trim();
  return res.status(200).json(libro)

});
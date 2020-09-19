const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const path = require("path");


app.set("port", process.env.PORT || 5000);

/* RUTAS */
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use(require("./router"));

/* RENDER */
app.set("views", path.join(__dirname, "./views"));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "./views/layouts/partials"),
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

  /* PARA ARCHIVOS ESTATICOS */

  app.use(express.static(path.join(__dirname, "./public")));

  app.listen(app.get("port"), () => {
    console.log('Servidor escuchando en el puerto: ', app.get('port'))
  });


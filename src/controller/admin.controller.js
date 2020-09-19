const controlador = {};
const cron = require("node-cron");

const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyDrCqZt8kJasSAmZcxEssZvbH7ozKQG2NQ",
  authDomain: "proyectoweb-baddd.firebaseapp.com",
  databaseURL: "https://proyectoweb-baddd.firebaseio.com",
  projectId: "proyectoweb-baddd",
  storageBucket: "proyectoweb-baddd.appspot.com",
  messagingSenderId: "652891057870",
  appId: "1:652891057870:web:841d32fc1fe8200b9eea9f",
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

var ultimaLocacion;

class pedidos {
  constructor(pendientes, aceptados) {
    this.pendientes = pendientes;
    this.aceptados = aceptados;
  }
}

class productos {
  constructor(Completas, Porciones) {
    this.Completas = Completas;
    this.Porciones = Porciones;
  }
}

class esentials {
  constructor() {
    this.productos = null;
    this.usuarioActivo = null;
    this.pedidos = null;
  }

  setProductos(productos) {
    this.productos = productos;
  }
  setUsuarioActivo(user) {
    this.usuarioActivo = user;
  }
  setPedidos(pedidos) {
    this.pedidos = pedidos;
  }
}

var esencial = new esentials();

controlador.registarUsuario = async (req, res) => {
  try {
    await auth.createUserWithEmailAndPassword(
      req.body.correo,
      req.body.password
    );
    await auth.signInWithEmailAndPassword(req.body.correo, req.body.password);
    let user = auth.currentUser;
    await user.updateProfile({
      displayName: req.body.nombre,
    });
    let reference = await db.collection("datosClientes").doc(user.uid);
    await reference.set({
      nombre: req.body.nombre,
      correo: req.body.correo,
      celular: req.body.celular,
    });
    await actualizer();
    res.render("index", { esencial });
  } catch (error) {
    console.log(error);
    res.render("login/register", { error });
  }
};

controlador.logearse = async (req, res) => {
  try {
    await auth.signInWithEmailAndPassword(
      req.body.emailLogin,
      req.body.contraseñaLogin
    );
    await actualizer();
    res.render("index", { esencial });
  } catch (error) {
    console.log(error);
    res.render("login/login", { error });
  }
};

controlador.cerrarSesion = async (req, res) => {
  try {
    await auth.signOut();
    await actualizer();
    res.render(ultimaLocacion, { esencial });
  } catch (error) {
    console.log(error);
  }
};

const importPedidos = () => {
  return new Promise((resolve) => {
    let pedidosuser;
    let pendientes = [];
    let aceptados = [];
    db.collection(auth.currentUser.uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.data().estado == "aceptado") {
            aceptados.push(doc.data());
          } else {
            pendientes.push(doc.data());
          }
        });
        pedidosuser = new pedidos(pendientes, aceptados);
        resolve(pedidosuser);
      })
      .catch(function (error) {
        console.log("Error: ", error);
      });
  });
};

const importProducts = () => {
  return new Promise((resolve) => {
    let products;
    let Porciones = [];
    let Completas = [];
    db.collection("Productos")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.data().tipo == "Porcion") {
            Porciones.push(doc.data());
          } else {
            Completas.push(doc.data());
          }
        });
        products = new productos(Completas, Porciones);
        resolve(products);
      })
      .catch(function (error) {
        console.log("Error: ", error);
      });
  });
};

controlador.inicio = async (req, res) => {
  await actualizer();
  res.render("index", { esencial });
  ultimaLocacion = "index";
};

controlador.menu = async (req, res) => {
  await actualizer();
  res.render("menu/menu", { esencial });
  ultimaLocacion = "menu/menu";
};

controlador.nosotros = async (req, res) => {
  await actualizer();
  res.render("sobreNosotros/sobreNosotros", { esencial });
  ultimaLocacion = "sobreNosotros/sobreNosotros";
};

controlador.sucursales = async (req, res) => {
  await actualizer();
  res.render("sucursales/sucursales", { esencial });
  ultimaLocacion = "sucursales/sucursales";
};

controlador.login = async (req, res) => {
  await actualizer();
  res.render("login/login");
  ultimaLocacion = "login/login";
};

controlador.register = async (req, res) => {
  await actualizer();
  res.render("login/register");
  ultimaLocacion = "login/register";
};

controlador.perfil = async (req, res) => {
  await actualizer();
  res.render("perfil/perfil", { esencial });
  ultimaLocacion = "perfil/perfil";
};

controlador.listaPedidos = async (req, res) => {
  await actualizer();
  res.render("perfil/listaPedidos", { esencial });
  ultimaLocacion = "perfil/listaPedidos";
};
controlador.historial = async (req, res) => {
  await actualizer();
  res.render("perfil/historial", { esencial });
  ultimaLocacion = "perfil/historial";
};

const actualizer = async () => {
  esencial.setUsuarioActivo(auth.currentUser);
  esencial.setProductos(await importProducts());
  esencial.setPedidos(await importPedidos);
};

cron.schedule("*/5 * * * * *", async () => {
  await actualizer();
});

module.exports = controlador;

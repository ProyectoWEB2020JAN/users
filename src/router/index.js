const { Router } = require("express");
const router = Router();

const controlador = require("../controller/admin.controller");

router.get("/", controlador.inicio);
router.get("/menu", controlador.menu);
router.get("/nosotros", controlador.nosotros);
router.get("/sucursales", controlador.sucursales);
router.get("/login", controlador.login);
router.get("/register", controlador.register);

router.post("/cerrarSesion", controlador.cerrarSesion);
router.post("/logearse", controlador.logearse);
router.post("/registrarse", controlador.registarUsuario);
router.get("/listaPedidos", controlador.listaPedidos);
router.get("/historial", controlador.historial);
router.get("/perfil", controlador.perfil);

module.exports = router;

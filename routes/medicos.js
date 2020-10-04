// Ruta: /api/hospitales
const { Router } = require('express');
const { getMedicos, crearMedicos, actualizarMedico, borrarMedico, getMedicoById } = require('../controllers/medicos')
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt')

const router = Router();


router.get('/', validarJWT, getMedicos);
router.post('/',
    [
        validarJWT,
        check('nombre', 'El nombre es necesario').not().isEmpty(),
        check('hospital', 'El hospital id debe ser válido').isMongoId(),
        validarCampos
    ],
    crearMedicos);
router.put('/:id',
    [
        validarJWT,
        check('nombre', 'El nombre es necesario').not().isEmpty(),
        validarCampos
    ],
    actualizarMedico);

router.delete('/:id', validarJWT, borrarMedico);
router.get('/:id', validarJWT, getMedicoById);

module.exports = router;
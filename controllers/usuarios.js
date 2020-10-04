const Usuario = require('../models/usuario');
const { response } = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res = response) => {
    const desde = Number(req.query.desde) || 0;
    const [usuarios, total] = await Promise.all([
        Usuario.find({}, 'nombre email role google img')
            .skip(desde)
            .limit(5),
        Usuario.countDocuments()
    ]);
    res.json({
        ok: true,
        usuarios,
        uid: req.uid,
        total
    });
}
const crearUsuarios = async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            })
        }

        const usuario = new Usuario(req.body);

        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        await usuario.save();
        console.log(usuario._id)
        const token = await generarJWT(usuario._id);
        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, revisar logs'
        })
    }

}
const actualizarUsuarios = async (req, res = response) => {
    const uid = req.params.id;

    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario con este id'
            });
        }
        const { password, google, email, ...campos } = req.body;
        if (usuarioDB.email !== email) {
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }
        if (!usuarioDB.google) {
            campos.email = email;
        } else if (usuarioDB.email !== email) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuarios de google no pueden cambiar su correo'
            });
        }
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });


        res.json({
            ok: true,
            usuarioActualizado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}
const borrarUsuario = async (req, res = response) => {
    const uid = req.params.id;
    try {
        const usuarioDB = await Usuario.findById(uid);
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe el usuario con este id'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuarios,
    borrarUsuario
}
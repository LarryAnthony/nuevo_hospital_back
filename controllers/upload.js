const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');
const { response } = require('express');

const fileUpload = (req, res) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un médico, usuario u hospital'
        });
    }
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningún archivo'
        });
    }

    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif', 'JPG', 'JPEG'];

    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es una extensión permitida'
        });
    }

    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Use the mv() method to place the file somewhere on your server
    file.mv(path, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover archivo'
            });

        }
        actualizarImagen(tipo, id, nombreArchivo);
        res.json({
            ok: true,
            nombreArchivo
        })
    });

}

const retornaImagen = (req, res = response) => {
    const tipo = req.params.tipo;
    const foto = req.params.foto;
    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    if (fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-img.png`);
        res.sendFile(pathImg);
    }

}

module.exports = {
    fileUpload,
    retornaImagen
}
const { response } = require('express');
const Medico = require('../models/medico');

const getMedicos = async (req, res = response) => {
    const medicos = await Medico.find()
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre img');
    res.status(200).json({
        ok: true,
        medicos
    })
}
const crearMedicos = async (req, res = response) => {
    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });
    try {
        const medicoDB = await medico.save();
        res.json({
            ok: true,
            medico: medicoDB
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}
const actualizarMedico = async (req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;

    try {
        const medico = await Medico.findById(id);
        if (!medico) {
            return res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador'
            });
        }
        const cambiosMedico = {
            ...req.body,
            id
        }
        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true });
        res.json({
            ok: true,
            medico: medicoActualizado
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }


}
const borrarMedico = async (req, res = response) => {
    const id = req.params.id;
    try {
        const medico = await Medico.findById(id);
        if (!medico) {
            return res.status(401).json({
                ok: false,
                msg: 'Médico no existe con ese id'
            })
        }

        await Medico.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: `Médico eliminado con ${id}`
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Contactarse con el administrador'
        });
    }
}

const getMedicoById = async (req, res = response) => {
    const id = req.params.id;

    try {
        const medico = await Medico.findById(id)
            .populate('usuario', 'nombre img')
            .populate('hospital', 'nombre img');
        res.status(200).json({
            ok: true,
            medico
        });
    } catch (error) {
        res.json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

module.exports = {
    getMedicos,
    crearMedicos,
    actualizarMedico,
    borrarMedico,
    getMedicoById
}
const express = require('express');
const app = express();

app.use(express.json());

const PORT = 3000;

// lista
const alumnos = [];



const calcularPromedioYEstado = (notas) => {
    const suma = notas.reduce((acc, nota) => acc+nota, 0);
    const promedio = suma / notas.length;

    let estado = 'reprobado';
    if (promedio >= 8) {
        estado = 'promocionado';
    } else if (promedio >= 6) {
        estado = 'aprobado';
    }
    return { promedio, estado };
};




// crear alumno
app.post('/alumnos', (req, res) => {
    const {nombre, notas} = req.body;

    if (!nombre || !notas || !Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).json({ error: 'datos incorrectos' });
    }

  // chequear si ya existe
    const alumnoExistente = alumnos.find(a => a.nombre.toLowerCase() === nombre.toLowerCase());
    if (alumnoExistente) {
        return res.status(400).json({ error: `El alumno "${nombre}" ya existe.` });
    }

    const nuevoAlumno = { nombre, notas };
    alumnos.push(nuevoAlumno);
    res.status(201).json(nuevoAlumno);
});


// obtener todo
app.get('/alumnos', (req, res) => {
    const alumnosConCalculos = alumnos.map(alumno => {
    const { promedio, estado } = calcularPromedioYEstado(alumno.notas);
    return {
        ...alumno,
        promedio,
        estado
        };
    });
    res.json(alumnosConCalculos);
});



app.get('/alumnos/:nombre', (req, res) => {
    const nombreAlumno = req.params.nombre;
    const alumno = alumnos.find(a=> a.nombre.toLowerCase() === nombreAlumno.toLowerCase());

    if (!alumno) {
        return res.status(404).json({ error: 'Alumno no encontrado' });
    }

    const { promedio, estado } = calcularPromedioYEstado(alumno.notas);
    res.json({ ...alumno, promedio, estado });
});




app.put('/alumnos/:nombre', (req, res) => {
    const nombreAlumno = req.params.nombre;
    const { notas } = req.body;

    if (!notas || !Array.isArray(notas) || notas.length !== 3) {
        return res.status(400).json({ error: 'Formato de notas incorrecto.' });
    }
    const alumnoIndex = alumnos.findIndex(a => a.nombre.toLowerCase() === nombreAlumno.toLowerCase());

    if (alumnoIndex === -1) {
        return res.status(404).json({ error: 'Alumno no encontrado' });
    }
    alumnos[alumnoIndex].notas = notas;
    res.json(alumnos[alumnoIndex]);
});

// borrar alumno
app.delete('/alumnos/:nombre', (req, res) => {
const nombreAlumno = req.params.nombre;
const alumnoIndex = alumnos.findIndex(a => a.nombre.toLowerCase() === nombreAlumno.toLowerCase());

if (alumnoIndex === -1) {
    return res.status(404).json({ error: 'Alumno no encontrado.' });
}

alumnos.splice(alumnoIndex, 1);
res.status(204).send();
});


app.listen(PORT, () => {
    console.log(`Servidor ej2 http://localhost:${PORT}`);
});
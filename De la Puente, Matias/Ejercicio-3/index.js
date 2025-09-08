const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// lista
const tareas = [];


// crear una tarea
app.post('/tareas', (req, res) => {
    //console.log(req.body)
    const { nombre } = req.body;


    if (!nombre) {
        return res.status(400).json({ error: 'El nombre de la tarea es obligatorio' });
    }
    const tareaExistente = tareas.find(t => t.nombre.toLowerCase() === nombre.toLowerCase());
    if (tareaExistente) {
        return res.status(400).json({ error: 'La tarea ya existe' });
    }

    const nuevaTarea = {
        nombre: nombre,
        completada: false
    };
    tareas.push(nuevaTarea);
    res.status(201).json(nuevaTarea);
});




app.get('/tareas', (req, res) => {
    const { completada } = req.query;



    if (completada !== undefined) {
        const esCompletada = completada === 'true';
        const tareasFiltradas = tareas.filter(t => t.completada === esCompletada);
        return res.json(tareasFiltradas);
    }
    res.json(tareas);
});

//completada o incompleta
app.put('/tareas/:nombre', (req, res) => {
    const nombreTarea = req.params.nombre;
    const { completada } = req.body;

    if (typeof completada !== 'boolean') {
        return res.status(400).json({ error: 'error' });
    }

    const tarea = tareas.find(t => t.nombre.toLowerCase() === nombreTarea.toLowerCase());

    if (!tarea) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    tarea.completada = completada;
    res.json(tarea);
});

// borrar una tarea
app.delete('/tareas/:nombre', (req, res) => {
    const nombreTarea = req.params.nombre;
    const tareaIndex = tareas.findIndex(t=> t.nombre.toLowerCase() === nombreTarea.toLowerCase());

    if(tareaIndex === -1) {
        return res.status(404).json({ error: 'la tarea no se encuentra' });
    }




    tareas.splice(tareaIndex, 1);
    res.status(204).send();
});


app.listen(PORT, () => {
    console.log(`Servidor http://localhost:${PORT}`);
});
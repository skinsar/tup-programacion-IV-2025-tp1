const express = require('express');
const app = express();

// para que el body funcione en json
app.use(express.json());


const PORT = 3000;

const calculos = [];


app.post('/calculos', (req, res) => {
    //console.log(req.body)
const { ladoA, ladoB } = req.body;

    // VALIDACION
if (ladoA === undefined || ladoB === undefined) {
    return res.status(400).json({ error: 'Faltan los valores de ladoA o ladoB.' });
}

  // que sean numeros positivos
if (typeof ladoA !== 'number' || typeof ladoB !== 'number' || ladoA<= 0 || ladoB <= 0) {
    return res.status(400).json({ error: 'Los valores de los lados deben ser números positivos.' });
}



const perimetro= 2* (ladoA + ladoB);
const superficie = ladoA * ladoB;

const nuevoCalculo = {
    ladoA: ladoA,
    ladoB:ladoB,
    perimetro: perimetro,
    superficie: superficie
    };

calculos.push(nuevoCalculo);




res.status(201).json(nuevoCalculo);
});


// Endpoint para ver todos los calculos
app.get('/calculos', (req, res) => {

    const resultadosConTipo = calculos.map(calculo => {
    const tipo = calculo.ladoA === calculo.ladoB ? 'cuadrado' : 'rectangulo';
    
    return {
        ...calculo,
        tipo: tipo
    };
});

    res.json(resultadosConTipo);
});



// Iniciar el server
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
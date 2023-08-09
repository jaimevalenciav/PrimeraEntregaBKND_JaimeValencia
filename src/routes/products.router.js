const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const FILE_PATH = path.join(__dirname, '../../products.json');

router.get('/api/products/', (req, res) => {
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        const products = JSON.parse(data);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

router.get('/api/products/:id', (req, res) => {
    const pid = parseInt(req.params.id);
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        const products = JSON.parse(data);
        const product = products.find(product => product.id === pid);
        if (!product) {
            return res.status(404).json({ error: 'El producto no se ha encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

router.post('/api/products', (req, res) => {
    const newProduct = req.body;
    newProduct.id = generateUniqueId();
   
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        const products = JSON.parse(data);
        products.push(newProduct);
        fs.writeFileSync(FILE_PATH, JSON.stringify(products, null, 2), 'utf8');
        res.json({ message: 'Producto se ha agregado satisfactoriamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

router.put('/api/products/:id', (req, res) => {
    const pid = parseInt(req.params.id);
    const updateFields = req.body;
    
    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ error: 'Se debe proporcionar al menos un campo para actualizar' });
    }

    try {
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        const products = JSON.parse(data);
        const productIndex = products.findIndex(product => product.id == pid);

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        products[productIndex] = {
            ...products[productIndex],
            ...updateFields
        };

        fs.writeFileSync(FILE_PATH, JSON.stringify(products, null, 2), 'utf8');
        res.json(products[productIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

router.delete('/api/products/:id', (req, res) => {
    const pid = req.params.id;
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf8');
        let products = JSON.parse(data);
        const productIndex = products.findIndex(product => product.id === pid);

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const deletedProduct = products.splice(productIndex, 1);

        fs.writeFileSync(FILE_PATH, JSON.stringify(products, null, 2), 'utf8');

        res.json(deletedProduct[0]);
        console.log(`Se elimina el artículo con código: ${deletedProduct[0].id}`)
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

// Generar ID único usando el tiempo actual
function generateUniqueId() {
    return Date.now().toString();
}

module.exports = router;

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const FILE_PATH = path.join(__dirname, '../../carts.json')
const FILE_PATH_Products = path.join(__dirname, '../../products.json')

router.get('/api/carts/:id', (req, res) => {
    const cartId = req.params.id;

    try {
        const cartData = fs.readFileSync(FILE_PATH, 'utf8');
        const carts = JSON.parse(cartData);

        const cart = carts.find(cart => cart.id === cartId);

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});



router.post('/api/carts/:id', (req, res) => {
    try {
        const productId = req.params.id;
        
        // Leer el archivo products.json para obtener el producto
        const productData = fs.readFileSync(FILE_PATH_Products, 'utf8');
        const products = JSON.parse(productData);
        
        const product = products.find(product => product.id == productId);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        // Crear un carrito con un ID automático y agregar el producto
        const cartId = generateUniqueId();
        const newCart = {
            id: cartId,
            products: [product.id]
        };

        // Leer el archivo cart.json para obtener los carritos existentes
        const cartData = fs.readFileSync(FILE_PATH, 'utf8');
        const carts = JSON.parse(cartData);

        // Agregar el nuevo carrito a la lista de carritos
        carts.push(newCart);

        // Guardar la lista actualizada de carritos en el archivo cart.json
        fs.writeFileSync(FILE_PATH, JSON.stringify(carts, null, 2), 'utf8');

        res.json({ message: 'Carrito creado y producto agregado satisfactoriamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el carrito y agregar el producto' });
    }
});

router.post('/api/carts/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid;
    console.log(cartId)
    const productId = req.params.pid;
    console.log(productId)
    const qty = req.body.quantity;
    console.log(qty)

    try {
        const cartData = fs.readFileSync(FILE_PATH, 'utf8');
        const carts = JSON.parse(cartData);

        const cart = carts.find(cart => cart.id == cartId);
        console.log(cart)

        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const productData = fs.readFileSync(FILE_PATH_Products, 'utf8');
        const products = JSON.parse(productData);

        const product = products.find(product => product.id == productId);
        const id = product.id
        console.log(id);

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        const existingProduct = cart.products.find(item => item.id === id);

        if (existingProduct) {
            // Si el producto ya existe, sumar la cantidad
            existingProduct.qty += qty;
        } else {
            // Si el producto no existe en el carrito, agregarlo
            cart.products.push({ id: id, qty: qty });
        }

        // Escribir los cambios de nuevo en el archivo
        fs.writeFileSync(FILE_PATH, JSON.stringify(carts, null, 2), 'utf8');

        res.json({ message: 'Producto agregado al carrito satisfactoriamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

function generateUniqueId() {
    return Date.now().toString();
}

module.exports = router;

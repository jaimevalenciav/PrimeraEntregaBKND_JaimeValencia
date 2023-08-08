const express= require('express');
const router = express.Router();
const fs = require('fs')
const products = []

router.get('/api/products', (req, res) =>{    
    try {
      fs.readFile('products.text', 'utf8', (err, data) => {
        if (err) {
          res.status(500).json({ error: 'Error al leer el archivo de productos' })
        } else {
          const products = JSON.parse(data)
          res.json({products})
        }
      })
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los productos' })
    }
    
})

router.get('/api/products/:id', (req, res) =>{
    const pid = parseInt(req.params.id)
    console.log(`Se busca el código: ${pid}`)
    try {
        fs.readFile('products.text', 'utf8', (err, data) => {
            if (err) {
                res.status(500).json({ error: 'Error al leer el archivo de productos' })
            } else {
                const products = JSON.parse(data)
                const product = products.find(product => product.id == pid)
                if(!product){
                    return res.status(404).json("El producto no se ha encontrado")
                }
                return res.json(product)
            }
        })
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' })
    }    
})

router.post('/api/products', (req, res) =>{
    const newProduct = req.body
    const productId = generateUniqueId()
    newProduct.id = productId
    products.push(newProduct)
    fs.writeFile('products.text', JSON.stringify(products), 'utf8', (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al escribir en el archivo de productos' });
        }
        
        res.json({ message: 'Producto se ha actualizado satisfactoriamente.' });
    })
})

function generateUniqueId() {
    return Date.now().toString()
}

router.put('/api/products/:pid',(req, res) => {
    const pid = parseInt(req.params.pid)
    const updateField  = req.body
    if(Object.keys(updateField).length === 0) {
        console.log(req.body)
        return res.status(400).json({error: 'Se debe proporcionar al menos un campo para actualizar' })
    }
    const productIndex= products.findIndex((product) => product.id == pid)

    if (productIndex === -1) {
        return res.status(404).json({error: 'Producto no encontrado'})
    }

    products[productIndex] = {
        ...product[productIndex],
        ...updateFields
    }

    fs.writeFile('productos.txt', JSON.stringify(products), 'utf8', (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al escribir en el archivo de productos' });
        }
        
        res.json(products[productIndex]);
    })
})

router.delete('/api/products/:id', (req, res) => {
    try {
        const pid = parseInt(req.params.id);
        console.log(pid)
        const productIndex = products.findIndex(product => product.id == pid);
        console.log(productIndex)
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        const deletedProduct = products.splice(productIndex, 1);
        fs.writeFile('productos.txt', JSON.stringify(products), 'utf8', (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error al escribir en el archivo de productos' });
            }
            res.json(deletedProduct[0]);
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
})


module.exports = router
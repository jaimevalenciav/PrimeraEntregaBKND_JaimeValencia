const express= require('express');
const router = express.Router();
const products = []

router.get('/api/carts', (req, res) =>{
    res.json({products})
})

router.get('/api/carts/:id', (req, res) =>{
    const pid = parseInt(req.params.pid)
    console.log(pid)
    const product = products.find(product => product.id === pid)
    if(!product){
        return res.status(404).json("El producto no se ha encontrado")
    }
    return res.json(product)
})

router.post('/api/carts', (req, res) =>{
    const newProduct = req.body
    const productId = generateUniqueId()
    newProduct.productId = productId
    products.push(newProduct)
    res.json({message: 'Producto se ha agregado satisfactoriamente.'})
})

function generateUniqueId() {
    return Date.now().toString()
}

router.put('/api/carts/:pid',(req, res) => {
    const pid = parseInt(req.params.pid)
    const updateField  = req.body
    if(Object.keys(updateField).length === 0) {
        return res.status(404).json({error: 'Se debe proporcionar al menos un campo para actualizar' })
    }
    const productIndex= products.findIndex((product) => product.id === pid)

    if (productIndex === -1) {
        return res.status(404).json({error: 'Producto no encontrado'})
    }

    products[productIndex] = {
        ...product[productIndex],
        ...updateFields
    }

    return res.json(products[productIndex])
})


module.exports = router
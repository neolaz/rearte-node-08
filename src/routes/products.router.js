import { Router } from "express";
import { ProductManager } from "../manager/product.Manager.js";

const router = Router();
const productManager = new ProductManager();

router.get('/', async(req, res) => {
    try {
        const { limit } = req.query;
        const products = await productManager.getProducts();

        limit && !isNaN(parseInt(limit))? res.status(200).json(products.slice(0,parseInt(limit))) : res.status(200).json(products);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.get('/:pid', async(req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid)

        product ? res.status(200).json(product) :  res.status(404).json({message: 'El producto ingresado no existe'});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
 });

router.post('/', async (req, res)=>{
    try {
        const msgFieldsError = await checkFields(req.body);
        if (msgFieldsError == "") {
            const newProduct = await productManager.addProduct(req.body);
            res.status(200).json(newProduct);
        } else {
            res.status(500).json({message: msgFieldsError});
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.put('/:pid', async (req, res)=>{
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid)
        const msgFieldsError = await checkFields(req.body);

        if (product && msgFieldsError == "") {
            await productManager.updateProductById(pid, req.body);
            res.status(200).json({message: `El producto ${pid} fue modificado`});
        } else {
            product ? res.status(400).json({message: msgFieldsError}) : res.status(400).json({message: `El producto ${pid} no existe`});
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.delete('/:pid', async (req, res)=>{
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid)

        if (product) {
            await productManager.deleteProductById(pid);
            res.status(200).json({message: `El producto ${pid} fue eliminado`});
        } else {
            res.status(400).json({message: `El producto ${pid} no existe`});
        } 
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

async function checkFields(product){
    const products = await productManager.getProducts();
    const p = products.find(p => p.code == product.code);
    let msgError = "";

    if (p !== undefined) msgError += "El código del producto que está intentando agregar está repetido. "
    if (product.code === undefined) msgError += "El código del producto no fue enviado. ";
    if (product.code == "") msgError += "El código del producto está vacío. ";
    if (product.title === undefined) msgError += "El título del producto no fue enviado. ";
    if (product.title == "") msgError += "El título del producto está vacío. ";
    if (product.description === undefined) msgError += "La descripción del producto no fue enviada. ";
    if (product.description == "") msgError += "La descripción del producto está vacía. ";
    if (product.price === undefined) msgError += "El precio del producto no fue enviado. ";
    if (product.price <= 0) msgError += "El precio del producto está vacío. ";
    if (product.stock === undefined) msgError += "El stock del producto no fue enviado. ";
    if (product.stock <= 0) msgError += "El stock del producto está vacío. ";
    if (product.category === undefined) msgError += "La categoría del producto no fue enviada. ";
    if (product.category == "") msgError += "La categoría del producto está vacía. ";
    if (product.status === undefined) msgError += "El status no fue enviado. ";
    if (product.thumbnail === undefined) msgError += "El thumbnail del producto no fue enviado.";    // Sólo valido que esté en el cuerpo del body, pero no si está vacío porque no es obligatorio.

    return msgError;
}

export default router;
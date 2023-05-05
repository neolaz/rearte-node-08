import { Router } from "express";
import { CartManager } from "../manager/cart.Manager.js";
import { ProductManager } from "../manager/product.Manager.js";

const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();

router.get('/', async(req, res) => {
    try {
        const { limit } = req.query;
        const carts = await cartManager.getCarts();

        limit && !isNaN(parseInt(limit))? res.status(200).json(carts.slice(0,parseInt(limit))) : res.status(200).json(carts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.get('/:cid', async(req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid)

        cart ? res.status(200).json(cart) :  res.status(404).json({message: 'El carrito ingresado no existe'});
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
 });

router.post('/', async (req, res)=>{
    try {
        const newCart = await cartManager.addCart();
        res.status(200).json(newCart);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res)=>{
    try {
        const { cid } = req.params;
        const { pid } = req.params;
        const cart = await cartManager.getCartById(cid);
        const product = await productManager.getProductById(pid);

        if(cart && product){
            const cart = await cartManager.addProductsToCart(cid, pid);
            res.status(200).json(cart);
        } else {
            cart ? res.status(400).json({message: `El producto ${pid} no existe`}) : res.status(400).json({message: `El carrito ${cid} no existe`});
        }

        
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

export default router;
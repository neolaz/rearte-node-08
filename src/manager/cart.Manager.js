import fs from 'fs';

export class CartManager{
    constructor (){
        this.path = './data/carts.json';
    }

    async addCart(){
        const newCart = { id: await this.generateCartId(), products: [] }
        const carts = await this.getCarts()
        carts.push(newCart);
        await fs.promises.writeFile(this.path, JSON.stringify(carts));
        return newCart;
    }

    async generateCartId(){
        const carts = await this.getCarts();
        return (carts.length > 0 ? carts[carts.length -1].id + 1 : 1);
    }

    async getCarts(){
        try {
            if (fs.existsSync(this.path)){
                const carts = await fs.promises.readFile(this.path, 'utf8');
                if (carts) {
                    return JSON.parse(carts); 
                } else {
                    return [];
                }
            } else {
                return [];
            }
        } catch (error) {
            console.log(error);  
        }
    }

    async addProductsToCart(cartId, productId){
        const carts = await this.getCarts();
        const cartIndex = await this.getCartIndex(cartId);
        const productIndex = await this.getCartProductIndex(cartId,productId);

        productIndex >= 0 ?  carts[cartIndex].products[productIndex].quantity++ : carts[cartIndex].products.push({id: parseInt(productId), quantity: 1});
        await fs.promises.writeFile(this.path, JSON.stringify(carts));
        return carts[cartIndex];
    }

    async getCartById(id){
        const carts = await this.getCarts();
        const c = carts.find(c => c.id == id);
        return c;
    }

    async getCartIndex(id){
        const carts = await this.getCarts();

        for (let i = 0; i < carts.length; i++) {
            if(carts[i].id == id) return i;
        }
        return -1;
    }

    async getCartProductIndex(cartId, productId){
        const cart = await this.getCartById(cartId);
        const cIndex = await this.getCartIndex(cartId);
        
        for (let i = 0; i < cart.products.length; i++) {
            if(cart.products[i].id == parseInt(productId)) return i;
        }
        return -1;
    }
}
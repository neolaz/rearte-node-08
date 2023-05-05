import fs from 'fs';

export class ProductManager{
    constructor (){
        this.path = './data/products.json';
    }

    async addProduct(product){
        product.status = true   // Por default es true.
        const newProduct = { id: await this.generateProductId(),...product }
        const products = await this.getProducts()
        products.push(newProduct);
        await fs.promises.writeFile(this.path, JSON.stringify(products));
        return newProduct;
    }

    async updateProductById(id, product){
        let products = await this.getProducts();
        const index = await this.getProductIndex(id);
        products[index] = {id: parseInt(id), ...product};
        await fs.promises.writeFile(this.path, JSON.stringify(products));
    }

    async deleteProductById(id){
        let products = await this.getProducts();
        products = products.filter(pr => pr.id != id);
        await fs.promises.writeFile(this.path, JSON.stringify(products));
    }

    async generateProductId(){
        const products = await this.getProducts();
        return (products.length > 0 ? products[products.length -1].id + 1 : 1);
    }

    async getProducts(){
        try {
            if (fs.existsSync(this.path)){
                const products = await fs.promises.readFile(this.path, 'utf8');
                if (products) {
                    return JSON.parse(products); 
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

    async getProductById(id){
        const products = await this.getProducts();
        const p = products.find(p => p.id == id);
        return p;
    }
    
    async getProductIndex(id){
        const products = await this.getProducts();
        
        for (let i = 0; i < products.length; i++) {
            if(products[i].id == id) return i;
        }
        return -1;
    }
}
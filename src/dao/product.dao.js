import ProductModel from "../models/product.model.js";
import { connectDB, isValidId } from "../config/mongoose.config.js";

export default class ProductDao {

    constructor() {
        // Intentamos conectar a la base de datos
        connectDB();
    }
    
    getProducts = async() => {
        try {
            return await ProductModel.find();
        } catch (error) {
            throw new Error({ message: "Error al obtener los productos en el dao", error: error.message });
        }
    }

    getProductById = async( id ) => {
        if (!isValidId(id)) {
            throw new Error("ID no válido");
        }
        try {
            return await ProductModel.findOne({ _id: id });
        } catch (error) {
            throw new Error( "Error al obtener el producto por el id: " + error.message );
        }
    }

    getProductByTitle = async(title) => {
        try {
            return await ProductModel.findOne({ title });
        } catch (error) {
            throw new Error( "Error al obtener el producto por el titulo: " + error.message );
        }
    }

    createProduct = async( productData ) => {
        try {
            const product = await ProductModel( productData );
            await product.save()
            return product;
        } catch (error) {
            throw new Error( "Error al crear un producto: " + error.message );
        }
    }

    updateProductById = async( id, doc ) => {
        if (!isValidId(id)) {
            throw new Error("ID no válido");
        }
        try {
            const product = await ProductModel.findById(id);
            if(!product) throw new Error("Producto no encontrado");
            return await ProductModel.findByIdAndUpdate(id, { $set: doc }, { new: true });
        } catch (error) {
            throw new Error(`Error al actualizar un usuario por el id: ${error.message}`);
        }
    }

    deleteProductById = async( id ) => {
        if (!isValidId(id)) {
            throw new Error("ID no válido");
        }
        try {
            const product = await ProductModel.findById(id);
            if(!product) throw new Error("Producto no encontrado");
            await ProductModel.findByIdAndDelete( id );
            return { status: 200, message: "Usuario eliminado exitosamente" };
        } catch (error) {
            throw new Error("Error al eliminar un usuario y su carrito: " + error.message);
        }
    }
}
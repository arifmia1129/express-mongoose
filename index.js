const express = require("express");
const app = express();
const mongoose = require("mongoose");

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/testProductDB");
        console.log("DB is connected!");
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
}


// product schema
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

const Product = mongoose.model("Product", productSchema);


app.get("/", (req, res) => {
    res.send("Welcome to our server");
})

app.post("/product", async (req, res) => {
    try {
        const product = new Product(req.body);
        const result = await product.save();

        res.status(201).json({
            success: true,
            message: "Successfully created the product",
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Couldn't create the product",
            error: error.message
        })
    }
})

app.post("/products", async (req, res) => {
    try {
        const result = await Product.insertMany(req.body);

        res.status(201).json({
            success: true,
            message: "Successfully created the products",
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Couldn't create the products",
            error: error.message
        })
    }
})
app.get("/products", async (req, res) => {
    try {

        const { price } = req.query;

        let products;

        if (price) {
            products = await Product.find({ price: { $gt: 1200 } });
            // products = await Product.find({ price: { $gte: 1200 } });
            // products = await Product.find({ price: { $lt: 1200 } });
            // products = await Product.find({ price: { $lte: 1200 } });
            // products = await Product.find({ price: { $eq: 1200 } });
            // products = await Product.find({ price: { $nt: 1200 } });
            // products = await Product.find({ price: { $in: 1200 } });
            // products = await Product.find({ price: { $nin: 1200 } });
        }
        else {
            products = await Product.find();
        }

        if (!products) {
            return res.status(404).json({
                success: false,
                message: "Products not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Successfully get the products",
            data: products
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Couldn't get the products",
            error: error.message
        })
    }
})

app.get("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findOne({ _id: id }).select({ _id: 0, title: 1, price: 1 });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Successfully get the product",
            data: product
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Couldn't get the product",
            error: error.message
        })
    }
})

app.listen(PORT, async () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    await connectDB();
})
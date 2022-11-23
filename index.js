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
            details: result
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
            details: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Couldn't create the products",
            error: error.message
        })
    }
})

app.listen(PORT, async () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    await connectDB();
})
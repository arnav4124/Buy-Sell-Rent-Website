const mongoose = require("mongoose");
const readline = require("readline");
const fs = require("fs");

// MongoDB connection URI
const MONGO_URI = "mongodb+srv://arnav:123@shopspot.kvwgj.mongodb.net/?retryWrites=true&w=majority&appName=ShopSpot"; // Replace with your database name

// Initialize mongoose connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const conn = mongoose.connection;

// GridFSBucket instance
let gfsBucket;
conn.once("open", () => {
  gfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads", // Name of the bucket to use
  });
  console.log("Connected to MongoDB and GridFSBucket initialized.");
});

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt user for input
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

// Main function to upload data
const main = async () => {
  try {
    const name = await prompt("Enter product name: ");
    const seller = await prompt("Enter seller name: ");
    const type = await prompt("Enter product type: ");
    const selleremail = await prompt("Enter seller email: ");
    const description = await prompt("Enter description: ");
    const price = await prompt("Enter price: ");
    const imagePath = await prompt("Enter image file path: ");

    // Validate image path
    if (!fs.existsSync(imagePath)) {
      console.error("Image file does not exist. Exiting.");
      process.exit(1);
    }

    // Upload image to GridFS
    const uploadStream = gfsBucket.openUploadStream(imagePath.split("/").pop());
    fs.createReadStream(imagePath).pipe(uploadStream);

    uploadStream.on("finish", async (file) => {
      console.log("Image uploaded successfully. File ID:", file._id);

      // Create product data
      const product = {
        name,
        seller,
        type,
        selleremail,
        description,
        price: parseFloat(price),
        photo: file._id, // Store the file ID as a reference
      };

      // Insert product data into a separate collection
      const Product = mongoose.model("Product", new mongoose.Schema({}, { strict: false }));
      const newProduct = new Product(product);
      await newProduct.save();

      console.log("Product saved successfully:", product);
      rl.close();
      process.exit(0);
    });

    uploadStream.on("error", (err) => {
      console.error("Error uploading image:", err);
      rl.close();
      process.exit(1);
    });
  } catch (err) {
    console.error("Error:", err);
    rl.close();
    process.exit(1);
  }
};

// Run the script
main();

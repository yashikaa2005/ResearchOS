const dotenv = require("dotenv");
const app = require("./app");
const connectDB = require("./config/db");

dotenv.config(); // Load environment variables

connectDB(); // Connect Database

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); //Starts Express


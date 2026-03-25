require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/database");
const { generateInterviewReport } = require("./src/services/ai.service");
const { resume, selfDescription, jobDescription } = require("./src/services/temp");

connectDB();
// generateInterviewReport({ resume, selfDescription, jobDescription });

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
});
const express =require('express');
const app =express();
const generateFile = require('./generateFile');
const executeCpp = require('./executeCpp');
const executePy = require('./executePy');

const cors = require("cors")
// midlleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.get('/' ,(req  , res)=>{
    res.send("Hello World!");
})

app.listen(8000 ,()=>{
    console.log("Server is listening on port:" ,8000);
})


app.post('/run', async (req, res) => {
    if (!req.body.language || !req.body.code) {
        return res.status(400).json({ success: false, error: "Language or code is missing in the request body." });
    }

    const { language, code } = req.body;

    try {
        // Store the user given code into a file
        const filePath = generateFile(language, code);

        let output;
        if (language === 'cpp') {
            output = await executeCpp(filePath);
        } else if (language === 'py') {
            output = await executePy(filePath);
        } else {
            return res.status(400).json({ success: false, error: "Unsupported language" });
        }

        res.json({ filePath, output });
    } catch (error) {
        if (error && error.message) {
            const errorMessage = error.message.toLowerCase(); // Convert to lowercase for case-insensitive matching
            if (errorMessage.includes('error') || errorMessage.includes('syntax error')) {
                return res.status(400).json({ success: false, error: error.message });
            }
        }
        return res.status(500).json({ success: false, error: "Unknown error occurred" });
    }
});

import express from "express";
import 'dotenv/config';
import axios from "axios";
import { Octokit } from "octokit";

const app = express();
let accessToken = null;

app.get("/", (req, res) => {
    res.send("<h1>Hello</h1><a href='/api/auth/github'>Login with GitHub</a>");
});

// Redirect user to GitHub OAuth
app.get('/api/auth/github', (req, res) => {
    const redirectUri = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo`;
    res.redirect(redirectUri);
});

// --- Hardcoded Code for testing ---
const Code = "b0bde8c28e82c58f707a";

// Exchange code for access token
app.get("/getGitHub", async (req, res) => {
    const code = Code; // Use dynamic `req.query.code` for production

    if (!code) return res.status(400).send("GitHub authorization code is missing.");

    try {
        const tokenRes = await axios.post("https://github.com/login/oauth/access_token", {
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: code
        }, {
            headers: { Accept: "application/json" }
        });

        accessToken = tokenRes.data.access_token;

        if (!accessToken) return res.status(400).send("Failed to get access token.");

        console.log("Access Token:", accessToken);
        res.redirect("/getUserDetails");
    } catch (error) {
        console.error("Token Exchange Error:", error);
        res.status(500).send("Failed to exchange code for access token.");
    }
});

// Get user info, create repo, add README.md
app.get("/getUserDetails", async (req, res) => {
    if (!accessToken) return res.status(400).send("Access token is missing.");

    try {
        const octokit = new Octokit({ auth: accessToken });

        // Get the authenticated user
        const { data: user } = await octokit.request("GET /user");
        const username = user.login;
        console.log("Authenticated as:", username);

        // Create a new repo
        const repoName = "Hello-Worldss";
        await octokit.request("POST /user/repos", {
            name: repoName,
            description: "This is your first repository created via API",
            private: false
        });

        console.log("Repository created:", repoName);

        // Add a README.md file
        const content = Buffer.from("# Hello World!\nCreated using GitHub API via Node.js").toString("base64");

        await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
            owner: username,
            repo: repoName,
            path: "README.md",
            message: "Initial commit with README.md",
            content: content,
            branch: "main" // GitHub uses 'main' by default
        });

        console.log("README.md added to repo");

        res.send(`<h2>Repo ${repoName} created with README.md!</h2>`);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Something went wrong: " + error.message);
    }
});


app.get("/appendGit", async (req,res) => {
    const octokit = new Octokit({ auth: accessToken });

    const owner = "Akshaay7705";      
    const repo = "Hello-World";         
    const filePath = "README.md";              
    const message = "Add README.md via API";   
    const content = Buffer.from("# Hello World from API!").toString("base64");
    
    try {
        const response = await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
            owner,
            repo,
            path: filePath,
            message,
            content,
            branch: "main" 
        });
    
        console.log("✅ File added:", response.data);
    } catch (error) {
        if (error.response && error.response.status === 422) {
            console.error("❌ File already exists. You may need to update instead.");
        } else {
            console.error("❌ Error uploading file:", error);
        }
    }
})
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on port ${process.env.PORT || 3000}...`);
});

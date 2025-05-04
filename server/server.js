import express from "express";
import 'dotenv/config';
import axios from "axios";
import { Octokit } from "octokit";
import cors from 'cors';
import { data } from "react-router-dom";

const app = express();
app.use(cors()); // Allow CORS for all origins by default
app.use(express.json());

// Endpoint to start the GitHub OAuth flow
app.get('/api/auth/github', (req, res) => {
    const redirectUri = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo`;
    res.redirect(redirectUri); // Redirect to GitHub login
});

const sendFormattedOutput = (data) => {
    
    const login = data.map(repo => {
        return {
            username: repo.owner.login,
            avatar: repo.owner.avatar_url,
            reponame: repo.name,
            link: repo.html_url
        };
    });
    return login
        
    
    


    
      
}
app.post('/api/auth/access_token', async (req, res) => {
     const { code } = req.body;

     if (!code) return res.status(400).send("GitHub authorization code is missing.");

     try {
         const tokenRes = await axios.post("https://github.com/login/oauth/access_token", {
             client_id: process.env.GITHUB_CLIENT_ID,
             client_secret: process.env.GITHUB_CLIENT_SECRET,
             code: code
         }, {
             headers: { Accept: "application/json" }
         });
 
         const accessToken = tokenRes.data.access_token;
 
         if (!accessToken) return res.status(400).send("Failed to get access token.");
 
         console.log("Access Token:", accessToken);
          res.status(200).json({"data" : {
            "access_token" : accessToken,
            "type" : "bearer",
            "code" : code
          }});
     } catch (error) {
         console.error("Token Exchange Error:", error);
         res.status(500).send("Failed to exchange code for access token.");
     }
});

app.post("/api/auth/getAllRepos",async (req, res) => {
    const { access_token } = req.body;
    const octokit = new Octokit({ auth : access_token});
    
    try{
        const { data: repos } = await octokit.request('GET /user/repos');
        // sendFormattedOutput(repos);
        
        return res.status(200).json({"data" : sendFormattedOutput(repos)});
    }
    catch(error){
         console.log("There is an error" + error);
         return res.status(401).json({"error" : `Could Not get the repos`});
         
    }

})
app.listen(process.env.PORT , () => {
    console.log(`Server listening on port ${process.env.PORT}...`);
});

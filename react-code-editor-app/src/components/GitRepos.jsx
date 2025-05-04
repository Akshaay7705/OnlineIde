// import React, { useState } from "react";
// import axios from "axios";
// import { Avatar, Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
// import { Link } from "react-router-dom";

// const GitRepos = ({code}) => {
//   const [accessToken, setAccessToken] = useState(null);
//   const [repos, setRepos] = useState([]);
  

//   const getRepos = async () => {
//     const formdata = { code: code };
//     console.log(formdata);
    
//     axios
//       .post(import.meta.env.VITE_ROOT + "/api/auth/access_token", formdata)
//       .then(async ({ data }) => {
//         const token = data.data.access_token;
//         console.log("Received token:", token);
//         setAccessToken(token);
//         showRepos(token);
//       })
//       .catch((error) => {
//         console.error("Error getting access token:", error);
//       });
//   };

//   const showRepos = async (token) => {
//     try {
//       const response = await axios.post(
//         import.meta.env.VITE_ROOT + "/api/auth/getAllRepos",
//         { access_token: token }
//       );

//       const formatted = response.data.data.map((repo) => ({
//         username : repo.username,
//         reponame : repo.reponame,
//         avatar : repo.avatar,
//         link : repo.link
//       }));

//       console.log(formatted[0].reponame);
//       setRepos(formatted);
      
//     } catch (error) {
//       console.error("Error fetching repos:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>Your Repositories</h1>
//       <button onClick={getRepos} style={{ padding: '10px 20px', backgroundColor: '#38a169', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
//         Get Repos
//       </button>

//       <div>
//         {repos.length === 0 ? (
//           <p>No repositories to show.</p>
//         ) : (
//           <div>
//             {repos.map((repo, index) => (
//               <div key={index} style={{ padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '10px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
//                 <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
//                   <img src={repo.avatar} alt={repo.username} style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
//                   <div>
//                     <h3 style={{ fontWeight: 'bold' }}>{repo.reponame}</h3>
//                     <p style={{ fontSize: '14px', color: '#4A5568' }}>by {repo.username}</p>
//                     <a href={repo.link} style={{ color: '#38a169', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
//                       View Repo
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GitRepos;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@chakra-ui/react";

const GitRepos = ({ code }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if repos are already stored in localStorage
    const storedRepos = JSON.parse(localStorage.getItem("repos"));
    if (storedRepos) {
      setRepos(storedRepos);
    }
  }, []);

  const getRepos = async () => {
    const formdata = { code: code };
    console.log(formdata);
    
    setLoading(true); // Set loading to true before the request
    
    axios
      .post(import.meta.env.VITE_ROOT + "/api/auth/access_token", formdata)
      .then(async ({ data }) => {
        const token = data.data.access_token;
        console.log("Received token:", token);
        setAccessToken(token);
        showRepos(token);
      })
      .catch((error) => {
        console.error("Error getting access token:", error);
      });
  };

  const showRepos = async (token) => {
    try {
      const response = await axios.post(
        import.meta.env.VITE_ROOT + "/api/auth/getAllRepos",
        { access_token: token }
      );

      const formatted = response.data.data.map((repo) => ({
        username: repo.username,
        reponame: repo.reponame,
        avatar: repo.avatar,
        link: repo.link
      }));

      console.log(formatted[0].reponame);
      setRepos(formatted);
      localStorage.setItem("repos", JSON.stringify(formatted)); // Store repos in localStorage
      setLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error("Error fetching repos:", error);
      setLoading(false); // Set loading to false if there's an error
    }
  };

  return (
    <div style={{height : "39rem", overflow : "scroll", scrollbarWidth: "none", msOverflowStyle: "none"  }}>
    <div style={{position: "sticky",
      top: 0,
      zIndex: 10,
      padding: "1rem",
      background : "grey",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid #e2e8f0"}}>
      <h1 style={{ }}>Your Repositories</h1>
      <Button colorScheme="teal">Add Repository</Button>
      </div>
      {/* Show the button only if repos haven't been fetched yet */}
      <div style={{marginTop : "2rem", position:"relative", top:"0"}}>
      {!repos.length && !loading && (
        <button
          onClick={getRepos}
          style={{
            padding: '10px 20px',
            backgroundColor: '#38a169',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginBottom : "5px"
          }}
        >
          Get Repos
        </button>
      )}

      <div style={{marginTop : "1rem"}}>
        {loading && <p>Loading...</p>} {/* Show loading indicator */}
        
        {repos.length === 0 ? (
          !loading && <p>No repositories to show.</p>
        ) : (
          <div>
            {repos.map((repo, index) => (
                <>
              <div
                key={index}
                style={{
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '10px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img
                    src={repo.avatar}
                    alt={repo.username}
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                  />
                  <div>
                    <h3 style={{ fontWeight: 'bold' }}>{repo.reponame}</h3>
                    <p style={{ fontSize: '14px', color: '#4A5568' }}>by {repo.username}</p>
                    <a
                      href={repo.link}
                      style={{ color: '#38a169', textDecoration: 'none' }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Repo
                    </a>
                  </div>
                </div>
              </div>
              <div style={{position : "relative" , bottom :"5rem", left:"35rem"}}>
                   <Button>
                    Add File
                   </Button>
              </div>
              </>
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default GitRepos;

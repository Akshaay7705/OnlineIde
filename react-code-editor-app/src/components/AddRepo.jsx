import React, { useState } from "react";

const AddRepo = () => {
  const [repoName, setRepoName] = useState("");
  const [repoDesc, setRepoDesc] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Repo Name:", repoName);
    console.log("Repo Description:", repoDesc);
    // Add API call logic here
    setRepoName("");
    setRepoDesc("");
  };

  return (
    <div style={{ position: "fixed", zIndex:"999", bottom:"26rem", right:"1.5rem", width:"42rem", padding: "1rem", backgroundColor: "#f4f4f4", margin: "1rem" }}>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Repository Name:</label><br />
          <input
            type="text"
            value={repoName}
            onChange={(e) => setRepoName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label><br />
          <textarea
            value={repoDesc}
            onChange={(e) => setRepoDesc(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Repository</button>
      </form>
    </div>
  );
};

export default AddRepo;

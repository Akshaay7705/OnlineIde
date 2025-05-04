import { useState, useRef, useEffect } from "react";
import { Box, Button, Text, Input, FormControl, FormLabel, useToast } from "@chakra-ui/react";
import { executeCode } from "../api";
import { lookInSession } from "./Sessions";
import axios from "axios";
import GitRepos from "./GitRepos";

const Output = ({ editorRef, language }) => {
  const toast = useToast();
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false); // state to control login form visibility
  const [code, setCode] = useState(null);

  const loginRef = useRef(); // Ref to the login form for detecting clicks outside

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "An error occurred.",
        description: error.message || "Unable to run code",
        status: "error",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeparams = urlParams.get("code");
    setCode(codeparams);
    codeparams ? setIsLoggedIn(true) : setIsLoggedIn(false);
  }, []);


  const uploadToGit = () => {
    setShowLogin(true); // Show login form when the button is clicked
  };

  const handleLogin = () => {
    console.log(import.meta.env.VITE_ROOT + "/api/auth/github");
    window.location.assign(`https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_CLIENT_ID}&scope=repo`);
};


  // Close the login form when clicking outside
  const handleClickOutside = (e) => {
    if (loginRef.current && !loginRef.current.contains(e.target)) {
      setShowLogin(false); // Close login form if clicked outside
    }
  };

  // Attach event listener to detect outside clicks
  useState(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Box w="50%" position="relative">
        {/* Show the login form as an overlay on top of the current content */}
        {showLogin && (
          <Box
            ref={loginRef}
            position="absolute"
            top={8}
            left={0}
            right={0}
            p={4}
            border="1px solid #444"
            borderRadius={4}
            mb={4}
            bg="gray.800" // Dark background
            color="white" // Light text for dark background
            boxShadow="md"
            zIndex={10}
          >
            
            {
              isLoggedIn ? <GitRepos code={code}/> : <Button colorScheme="teal" onClick={handleLogin}>
              Login with github
            </Button>
            }
            
          </Box>
        )}

        <Text mb={2} fontSize="lg">Output</Text>
        <Button
          variant="outline"
          colorScheme="green"
          mb={4}
          isLoading={isLoading}
          onClick={runCode}
        >
          Run Code
        </Button>

        <Button
          variant="outline"
          colorScheme="green"
          mb={4}
          ml={4}
          onClick={uploadToGit}
        >
          Add to Github
        </Button>

        <Box
          height="75vh"
          p={2}
          color={isError ? "red.400" : ""}
          border="1px solid"
          borderRadius={4}
          borderColor={isError ? "red.500" : "#333"}
        >
          {output
            ? output.map((line, i) => <Text key={i}>{line}</Text>)
            : 'Click "Run Code" to see the output here'}
        </Box>
      </Box>
    </>
  );
};

export default Output;

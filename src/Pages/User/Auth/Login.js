import React from "react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import {Link} from 'react-router-dom'
import { useEffect, useState } from 'react'
import {useLocation,useNavigate} from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { set_Authentication } from "../../../Redux/Authentication/AuthenticationSlice";
import {jwtDecode} from "jwt-decode";
import { GoogleLogin } from '@react-oauth/google';
import { Switch } from '@chakra-ui/react'


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLoginSubmit = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", { username, password });

      const { access, refresh, user_type, user_data } = response.data;

      // Store tokens in localStorage
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      // Dispatch user data to Redux
      dispatch(
        set_Authentication({
          user_data: user_data,
          isAuthenticated: true,
        })
      );

      // Redirect based on user_type
      if (user_type === "admin") navigate("/admin/home");
      else if (user_type === "buyer") navigate("/buyer/home");
      else if (user_type === "seller") navigate("/seller/home");
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          const errorMessages = Object.values(data.errors).flat().join(", ");
          toast({ title: "Validation Error", description: errorMessages, status: "error" });
        } else if (status === 401) {
          toast({ title: "Unauthorized", description: data.error, status: "error" });
        } else {
          toast({ title: "Error", description: "Something went wrong", status: "error" });
        }
      } else {
        toast({ title: "Error", description: "Network Error", status: "error" });
      }
    }
  };




  return (
    <>
        <Flex minH={"100vh"} justify={"center"} pt={"45px"} backdropColor={"white"}>
      <Box rounded={"lg"} bg={useColorModeValue("white", "gray.700")} boxShadow={"lg"} p={8} width={"800px"} height={"600px"}>
        <Stack align={"center"}>
          <Heading fontSize={"1xl"}>Log In</Heading>
        </Stack>

        <Stack spacing={4}>
          <FormControl id="username">
            <FormLabel>Username</FormLabel>
            <Input type="text" onChange={(event) => setUsername(event.target.value)} />
          </FormControl>

          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input type="password" onChange={(event) => setPassword(event.target.value)} />
          </FormControl>

          <ReCAPTCHA sitekey={"6LfddA4pAAAAAJ7YSN-7v_2qgtZ4zLeZuKu-S6jM"} />

          <Stack align={"center"}>
            <Button
              bg={"green.400"}
              width={"60%"}
              color={"white"}
              _hover={{ bg: "green.500" }}
              onClick={handleLoginSubmit}
            >
              Log In
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Flex>
    </>
  );
}

export default Login;

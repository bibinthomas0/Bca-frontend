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
  useColorModeValue,
} from "@chakra-ui/react";
import {Link} from 'react-router-dom'
import { useEffect, useState } from 'react'
import {useLocation,useNavigate} from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import { set_Authentication } from "../../Redux/Authentication/AuthenticationSlice";
import {jwtDecode} from "jwt-decode";





function AdminLogin() {
  const { state } = useLocation();
  const [message, setmessage] = useState(null)
  const [formError, setFormError] = useState([])
  const baseURL='http://127.0.0.1:8000'

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if(state){
      console.log('gg',state);
      setmessage(state)
    }
    
    navigate('', {}); 
    
  }, [state,navigate])
  const [Email,setEmail] = useState("")
  const [Passwordd,setPasswordd] = useState("")

  const handleLoginSubmit = async(event)=> {
    event.preventDefault();
    setFormError([])
    const formData = new FormData();
    formData.append("email", Email);
    formData.append("password", Passwordd);
    try {
      console.log(Email,Passwordd,'kkkkkk',formData)
      const ggg = {"email":Email,"password":Passwordd}
      console.log(ggg)
      const res = await axios.post(baseURL+'/api/accounts/login/', ggg)
      console.log('mmmmmm',res.data);

      if(res.status === 200){
        localStorage.setItem('access', res.data.access)
        localStorage.setItem('refresh', res.data.refresh)
        console.log(res.data);
        console.log('bfore',res.data.access);
        dispatch(
          set_Authentication({
            name: jwtDecode(res.data.access).username, 
            isAuthenticated: true,
            isAdmin:res.data.isAdmin
          })
        );
        console.log('after',jwtDecode(res.data.access).username);
        navigate('users')
        return res
      }  
      
    }
    catch (error) {
      console.log('ttttttttt',error);
      if (error.response.status===401)
      {
       
        setFormError(error.response.data)
      }
      else
      {
        console.log(error);
  
      }
    }
  }
  





  return (
    <>
      <Flex
        minH={"100vh"}
        justify={"center"}
        pt={"45px"}
        backdropColor={"white"}
    >
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
          width={"800px"}
          height={"600px"}
        >
          <Stack align={"center"}>
            <Heading fontSize={"1xl"}>Admin Log In</Heading>
            <Stack
              direction={{ base: "column", sm: "row" }}
              align={"start"}
              justify={"space-between"}
              mt={"5"}
              mb={"5"}
            >
              <Button
                background={NaN}
                color={"#1877f2"}
                border={"1px"}
                rightIcon={<FaFacebook />}
                width={"300px"}
                _hover={{
                  bg: "#1877f2",
                  color: "white",
                }}
              >
                Continue with 
              </Button>
              <Button
                background={NaN}
                color={"#DB4437"}
                border={"1px"}
                rightIcon={<FaGoogle />}
                width={"300px"}
                _hover={{
                  bg: "#DB4437",
                  color: "white",
                }}
              >
                Continue with 
              </Button>
            </Stack>
            <Text>or</Text>

          </Stack>

          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email address</FormLabel>
              <Input type="email" onChange={(event)=> setEmail(event.target.value)} />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Password</FormLabel>
              <Input type="password" onChange={(event)=>setPasswordd(event.target.value)} />
            </FormControl>
            <ReCAPTCHA sitekey={"6LfddA4pAAAAAJ7YSN-7v_2qgtZ4zLeZuKu-S6jM"} />
            <Stack align={"center"}>
              <Button
                bg={NaN}
                width={"60%"}
                border={"1px"}
                color={"green"}
                _hover={{
                  bg: "green.500",
                  color: "white",
                }} onClick={handleLoginSubmit}
              >
                Log In
              </Button>
            </Stack>
            <Stack
              direction={{ base: "column", sm: "row" }}
              align={"start"}
              justify={"space-between"}
            >
              <Link style={{color:"blue"}} to="/admincontrol/signup">Create an account</Link>
              <Link color={"blue.400"}>Forgot password?</Link>
            </Stack>
          </Stack>
        </Box>
      </Flex>
    </>
  );
}

export default AdminLogin;
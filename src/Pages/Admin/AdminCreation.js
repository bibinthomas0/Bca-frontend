import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import UserRegdetails, { setUser_registration } from "../../Redux/User/UserRegdetails";
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
  FormErrorMessage,
} from "@chakra-ui/react";
import { useDispatch,useSelector } from "react-redux";

function AdminCreation({ onChildData }) {
  const breakpoints = {
    base: "0em", // 0px
    sm: "30em", // ~480px. em is a relative unit and is dependant on the font size.
    md: "48em", // ~768px
    lg: "62em", // ~992px
    xl: "80em", // ~1280px
    "2xl": "96em",
  };
  
  const dispatch = useDispatch();
  const [Email, setEmail] = useState({
    email: "",
  });
  const [Password, setPassword] = useState("");
  const [firstpass, setFirstPass] = useState("");
  const [validPassword, setValidpassword] = useState(false);
  const [formError, setFormError] = useState([]);
  const [usern, setusern] = useState({
    username: "",
  });
  const [birthdate, setBirthdate] = useState("");
  const [isAbove18, setIsAbove18] = useState(false);
  const [passAlert, setPassAlert] = useState("");
  const navigate = useNavigate();
  const baseURL = "http://127.0.0.1:8000";
  const [captcha, setcaptcha] = useState(false);
  const [name,setName] = useState("");
 

  useEffect(() => {
    const passwordlength = () => {
      const len = firstpass.length;
      if (len < 8 && len > 0) {
        setPassAlert("Minimum length is 8");
      } else {
        setPassAlert("");
      }
    };

    passwordlength();
  }, [firstpass]);

  useEffect(() => {
    if(usern.username.length >0){
    const fetchData = async () => {
      try {
        const res = await axios.post(
          baseURL + "/api/accounts/username/",
          usern
        );
        if (res.status === 202) {
          setFormError([]);

          console.log("success");
        }
      } catch (error) {
        if (error.response && error.response.status === 406) {
          console.log("error");
          console.log(error.response.data);
          setFormError(error.response.data);
        } else {
          console.error(error);
        }
      }
    };
    fetchData();
  }

    
  }, [usern]);
  const sendDataToParent = () => {
    const dataToSend = 'Hello from Child!';
    onChildData(dataToSend);
  };
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const res = await axios.post(baseURL + "/api/accounts/otp/", Email);
      if (res.status === 201) {
        console.log(res.data.otp);
        dispatch(
          setUser_registration({
            name: name,
            username: usern.username,
            email: Email.email,
            dob: birthdate,
            password: Password,
            otp:res.data.otp
          })
        );
        sendDataToParent()
         
      } 
    } catch (error) {
      if (error.response.status === 406) {
        console.log("error");
        console.log(error.response.data);
        setFormError(error.response.data);
      } else {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    return () => {
      const checkAge = () => {
        const birthdateDate = new Date(birthdate);
        const currentDate = new Date();
        const ageDifference =
          currentDate.getFullYear() - birthdateDate.getFullYear();
        setIsAbove18(ageDifference >= 18);
      };
      checkAge();
    };
  }, [birthdate]);

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
          bg={"white"}
          boxShadow={"lg"}
          p={8}
          width={"800px"}
          height={"800px"}
        >
          <Stack align={"center"}>
            <Heading fontSize={"1xl"}>Admin Register</Heading>
            <Stack
              direction={{ base: "column", sm: "row" }}
              align={"start"}
              justify={"space-between"}
              mt={"5"}
              mb={"5"}
            >
              {/* Buttons for social login */}
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
                Register with Facebook
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
                Register with Google
              </Button>
            </Stack>
            <Text>or</Text>
          </Stack>
          <Stack spacing={4}>
            {Object.keys(formError).map((key) =>
              Array.isArray(formError[key]) ? (
                formError[key].map((message, index) => (
                  <Text key={`${key}_${index}`}>{message}</Text>
                ))
              ) : (
                <Text color={"red"} key={key}>
                  {formError[key]}
                </Text>
              )
            )}

            <Flex w={[300, 400, 500]}>
            <FormControl id="username" w={[300, 400, 500]} isRequired>
    <FormLabel>Username</FormLabel>
    <Input
      type="text"
      id="username"
      value={usern.username}
      onChange={(event) => setusern({ ...usern, username: event.target.value })}
      isRequired
    />
  </FormControl>
  <FormControl id="date" w={[300, 400, 500]} ml={"20px"}>
    <FormLabel>Date of birth</FormLabel>
    <Input
      type="date"
      id="dob"
      value={birthdate}
      onChange={(event) => setBirthdate(event.target.value)}
      isRequired
    />
  </FormControl> </Flex>
  <FormControl id="name" isRequired>
    <FormLabel>Full name</FormLabel>
    <Input
      type="text"
      id="name"
      onChange={(event) => setName(event.target.value)}
     isRequired
    />
  </FormControl>
  <FormControl id="email" isRequired>
    <FormLabel>Email</FormLabel>
    <Input
      type="email"
      id="email"
      value={Email.email}
      onChange={(event) => setEmail({ ...Email, email: event.target.value })}
      isRequired
    /> 
  </FormControl>
  <FormControl id="password" isRequired>
    <FormLabel>Password</FormLabel>
    <Input
      type="password"
      id="password"
      onChange={(event) => setFirstPass(event.target.value)}
      isRequired
    />
    <Text color={"red"}>{passAlert}</Text>
  </FormControl>
  <FormControl id="confirm_password" isRequired>
    <FormLabel>Confirm password</FormLabel>
    <Input
      type="password"
      id="confirmPassword"
      onChange={(event) => setPassword(event.target.value)}
      isRequired
    />
  </FormControl>
  <ReCAPTCHA onChange={(event) => setcaptcha(true)} sitekey={"6LfddA4pAAAAAJ7YSN-7v_2qgtZ4zLeZuKu-S6jM"} />
  {captcha && 
  <Stack align={"center"}>
    <Button
      bg={NaN}
      width={"60%"}
      border={"1px"}
      color={"green"}
      _hover={{
        bg: "green.500",
        color: "white",
      }}
      onClick={isAbove18 ? handleRegisterSubmit : () => alert('you are underage')}
    >
      Register
    </Button>
  </Stack>}
            <Stack
              direction={{ base: "column", sm: "row" }}
              align={"start"}
              justify={"space-between"}
            >
              <Link style={{ color: "blue" }} to="/">
                Already have an account
              </Link>
              <Link color={"blue.400"}>Forgot password?</Link>
            </Stack>
          </Stack>
        </Box>
      </Flex>
    </>
  );
}


export default AdminCreation;

import React, { useState, useEffect } from "react";
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
  HStack,
} from "@chakra-ui/react";
import { PinInput, PinInputField } from '@chakra-ui/react'
import Countdown from 'react-countdown';
import { useSelector,useDispatch } from "react-redux";
import { Link ,useNavigate} from 'react-router-dom'
import axios from 'axios'




function OtpVerification() {
    const breakpoints = {
        base: "0em", // 0px
        sm: "30em", // ~480px. em is a relative unit and is dependant on the font size.
        md: "48em", // ~768px
        lg: "62em", // ~992px
        xl: "80em", // ~1280px
        "2xl": "96em", // ~1536px
      };
      const dispatch = useDispatch();
      const [userOtp,setUserOtp] = useState("")
      const targetDate = Date.now() + 990000;
      const userRegDetails = useSelector(state => state.User_registration)
      const [formError, setFormError] = useState("")
      const navigate = useNavigate();
      const baseURL='http://127.0.0.1:8000'
      const [Otp,setOtp] = useState("")
      const [seconds, setSeconds] = useState(59);
      
    
      
   

    

      useEffect(() => {
        setOtp(userRegDetails.otp) 
      
        return () => {
        
        };
      }, [OtpVerification]);
      
      
      console.log("old",Otp)
      const HandleOtp = async () =>{
        if(Otp === userOtp){ 
          try {
            const res = await axios.post(baseURL+'/api/accounts/register/', userRegDetails)
            if(res.status === 201){
              navigate('/',
              {
                state:res.data.Message
              })
              return res
            }  
            
          }
          catch (error) {
            
            if (error.response.status===406)
            {
              console.log("error")
              console.log(error.response.data)
              setFormError(error.response.data)
            }
            else
            {
              console.log(error);
        
            }
          }
        }else{
          setFormError("invalid Otp")
        }
      }
      const resendOtp = async () =>{
        const emailObject = {
          email: userRegDetails.email
          
        };
        try {
          const res = await axios.post(baseURL + "/api/accounts/otp/", emailObject);
          if (res.status === 201) {
            console.log(res.data.otp);
            setOtp(res.data.otp)
            console.log(Otp)
        
             
          } 
        }catch (error) {
          if (error.response.status === 406) {
            console.log("error");
            console.log(error.response.data);
            setFormError(error.response.data);
          } else {
            console.log(error);
          }
        }


      }
      useEffect(() => {
        const timer = setInterval(() => {
          setSeconds((prevSeconds) => prevSeconds - 1);
        }, 1000);
    
        // Cleanup the interval when the component unmounts
        return () => clearInterval(timer);
      }, [setOtp]);
 


  return (
    <>
    <Flex
      minH={"100%"}
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
        height={"40%"}
        mt={'5%'}
      >
        <Stack align={"center"} margin={'25px'}>
          <Heading fontSize={"1xl"}>Verify Otp</Heading>
        </Stack>

        <Stack spacing={4}  >
      
            <Text color={"red"} >
                  {formError}
                </Text>
    
            <Stack  align={'center'}>
            <HStack>
  <PinInput onChange={(value) => setUserOtp(value)}>
    <PinInputField />
    <PinInputField />
    <PinInputField />
    <PinInputField />
    <PinInputField />
    <PinInputField />
  </PinInput>
</HStack>
          </Stack>
          <Stack  align={'center'}>
            <Button
              bg={NaN}
              width={"20%"}
              border={"1px"}
              color={"green"}
              _hover={{
                bg: "green.500",
                color: "white",
              }}
              onClick={HandleOtp}
            >
              verify
            </Button>
          </Stack>
          <Stack
            direction={{ base: "column", sm: "row" }}
            align={"start"}
            justify={"space-between"}
          >
            {seconds > 0?(<Text color={"blue.400"}>Resend otp in {seconds}s</Text>):
            <Button onClick={resendOtp} color={"grey"}>resend</Button>}
            

          </Stack>
        </Stack>
      </Box> 
    </Flex>
  </>
  )
}
export default OtpVerification;

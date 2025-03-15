import React, { useEffect, useState } from "react";
import Usercreation from "./Usercreation";
import OtpVerification from "../../InBoth/OtpVerification";
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, FormControl, FormLabel, Input, Select, VStack, useToast, Checkbox } from '@chakra-ui/react';

function Register() {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone_number: '',
    password: '',
    is_seller: false,
    is_buyer: false,
    pincode: '',
    district: '',
    location: '',
    date_of_birth: '',
    company_name: '',
    company_address: '',
    gstin: '',
    language: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = { ...formData };

    if (formData.is_buyer) {
      delete requestData.company_name;
      delete requestData.company_address;
      delete requestData.gstin;
      delete requestData.language;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', requestData);
      if (response.status === 201) {
        toast({ title: 'User registered successfully.', status: 'success', duration: 3000, isClosable: true });
        navigate('/');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.errors || { general: ['Registration failed'] };
      Object.keys(errorMessage).forEach((field) => {
        toast({ title: `${field}: ${errorMessage[field].join(', ')}`, status: 'error', duration: 5000, isClosable: true });
      });
    }
  };

  
  return (
    <Box maxW="500px" mx="auto" mt={10} p={6} borderWidth={1} borderRadius={8} boxShadow="lg">
    <form onSubmit={handleSubmit}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired>
          <FormLabel>Username</FormLabel>
          <Input name="username" value={formData.username} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input type="email" name="email" value={formData.email} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Phone Number</FormLabel>
          <Input name="phone_number" value={formData.phone_number} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" name="password" value={formData.password} onChange={handleChange} />
        </FormControl>

        <Checkbox name="is_seller" isChecked={formData.is_seller} onChange={handleChange}>Seller</Checkbox>
        <Checkbox name="is_buyer" isChecked={formData.is_buyer} onChange={handleChange}>Buyer</Checkbox>

        <FormControl isRequired>
          <FormLabel>Pincode</FormLabel>
          <Input name="pincode" value={formData.pincode} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>District</FormLabel>
          <Input name="district" value={formData.district} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Location</FormLabel>
          <Input name="location" value={formData.location} onChange={handleChange} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Date of Birth</FormLabel>
          <Input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
        </FormControl>

        {formData.is_seller && (
          <>
            <FormControl>
              <FormLabel>Company Name</FormLabel>
              <Input name="company_name" value={formData.company_name} onChange={handleChange} />
            </FormControl>

            <FormControl>
              <FormLabel>Company Address</FormLabel>
              <Input name="company_address" value={formData.company_address} onChange={handleChange} />
            </FormControl>

            <FormControl>
              <FormLabel>GSTIN</FormLabel>
              <Input name="gstin" value={formData.gstin} onChange={handleChange} />
            </FormControl>

            <FormControl>
              <FormLabel>Language</FormLabel>
              <Input name="language" value={formData.language} onChange={handleChange} />
            </FormControl>
          </>
        )}

        <Button type="submit" colorScheme="teal" width="full">Register</Button>
      </VStack>
    </form>
  </Box>
  );
}

export default Register;

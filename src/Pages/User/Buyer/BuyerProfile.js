import { useState, useEffect } from "react";
import {
    Box, Button, Input, FormLabel, VStack, useToast, Heading, Checkbox,
    CheckboxGroup, Stack, Flex, Spinner,Text
  } from "@chakra-ui/react"; 
import { useNavigate } from "react-router-dom";
import apiClient from "../Auth/AxiosInstance";



const Sidebar = ({ selected, onSelect }) => {
    const navigate = useNavigate();
    const menuItems = [
        { label: "Products", path: "/buyer/home" },
        { label: "My Orders", path: "/buyer/orders" },
        { label: "My Wishlist", path: "/buyer/wishlist" },
        { label: "My Cart", path: "/buyer/cart" },
        { label: "Enquiries", path: "/buyer/enquiries" },
        { label: "Help & Support", path: "/buyer/help" },
      ];
    const handleSelect = (item) => {
      onSelect(item.label);
      navigate(item.path);
    };
  
    return (
      <VStack w="250px" bg="beige" h="100vh" p={4} spacing={6} align="stretch">
         <Text fontSize="2xl"  my={6}>BUYER</Text>
        {menuItems.map((item) => (
          <Box
            key={item.label}
            p={3}
            bg={selected === item.label ? "white" : "transparent"}
            borderRadius="md"
            cursor="pointer"
            onClick={() => handleSelect(item)}
            _hover={{ bg: "white" }}
          >
            {item.label}
          </Box>
        ))}
      </VStack>
    );
}

const BuyerProfile = () => {
    const toast = useToast();
    const [userData, setUserData] = useState(null);
    const [pincodeOptions, setPincodeOptions] = useState([]);
    const [selectedPincodes, setSelectedPincodes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [selected, setSelected] = useState("");
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [userRes, pinRes] = await Promise.all([
            apiClient.get("/api/user-details/"),
            apiClient.get("/api/seller-pincodes/")
          ]);
  
          setUserData(userRes.data);
          const pinList = pinRes.data
            .map((s) => s.split(","))
            .flat()
            .filter((v, i, a) => a.indexOf(v) === i); // unique pincodes
          setPincodeOptions(pinList);
          setSelectedPincodes(userRes.data.selected_pincodes.split(","));
        } catch (err) {
          toast({
            title: "Error loading profile.",
            status: "error",
            isClosable: true,
          });
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchData();
    }, [toast]);
  
    const handleChange = (field, value) => {
      setUserData((prev) => ({ ...prev, [field]: value }));
    };
  
    const handleUpdate = async () => {
      setIsUpdating(true);
      try {
        const payload = {
          ...userData,
          selected_pincodes: selectedPincodes.join(","),
        };
  
        const response = await apiClient.put("/api/update-user/", payload);
  
        toast({
          title: "Profile updated successfully.",
          status: "success",
          isClosable: true,
        });
        setUserData(response.data.data);
      } catch (err) {
        toast({
          title: "Failed to update profile.",
          status: "error",
          isClosable: true,
        });
      } finally {
        setIsUpdating(false);
      }
    };
  
    if (isLoading) {
      return (
        <Flex justify="center" align="center" height="100vh">
          <Spinner size="xl" />
        </Flex>
      );
    }
  
    return (
       <Flex h="100vh" bg="white" color="black">
         <Sidebar selected={selected} onSelect={setSelected} />
      <Box bg="white" p={8} borderRadius="md" shadow="md" maxW="600px" mx="auto">

        <Heading size="lg" mb={6}>
          Buyer Profile
        </Heading>
        <VStack spacing={4} align="stretch">
          <Box>
            <FormLabel>Username</FormLabel>
            <Input
              value={userData.username}
              onChange={(e) => handleChange("username", e.target.value)}
            />
          </Box>
          <Box>
            <FormLabel>Email</FormLabel>
            <Input
              value={userData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </Box>
          <Box>
            <FormLabel>Phone Number</FormLabel>
            <Input
              value={userData.phone_number}
              onChange={(e) => handleChange("phone_number", e.target.value)}
            />
          </Box>
         
          <Box>
            <FormLabel>Seller Pincodes</FormLabel>
            <CheckboxGroup value={selectedPincodes} onChange={setSelectedPincodes}>
              <Stack spacing={2} direction="column">
                {pincodeOptions.map((pin) => (
                  <Checkbox key={pin} value={pin}>
                    {pin}
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
          </Box>
          <Button
            colorScheme="blue"
            onClick={handleUpdate}
            isLoading={isUpdating}
            alignSelf="flex-end"
          >
            Save Changes
          </Button>
        </VStack>
      </Box>
      </Flex>
    );
  };
  
  export default BuyerProfile;

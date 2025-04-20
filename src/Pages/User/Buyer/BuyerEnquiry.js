import { useState, useEffect } from "react";
import {
  Box, Button, HStack, Text, Flex, Menu, MenuItem, MenuButton, MenuList,
  VStack, useToast, Image
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
};

const BuyerEnquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [selected, setSelected] = useState("Enquiries");
  const toast = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const response = await apiClient.get("/api/enquiries/");
        setEnquiries(response.data);
      } catch (error) {
        toast({
          title: "Error fetching enquiries",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchEnquiries();
  }, [toast]);

  return (
    <Flex h="100vh" bg="white" color="black">
      <Sidebar selected={selected} onSelect={setSelected} />
      <Box flex="1" p={6} overflowY="auto">
        <Flex justify="space-between" mb={4}>
          <Text fontSize="2xl" fontWeight="bold">My Enquiries</Text>
          <Menu>
              <MenuButton as={Button} colorScheme="blue">Profile</MenuButton>
              <MenuList>
                <MenuItem  onClick={() => navigate("/buyer/profile")}> View Profile</MenuItem>
                <MenuItem
  onClick={() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/"); 
  }}
>
  Logout
</MenuItem>
              </MenuList>
            </Menu>
        </Flex>

        {enquiries.length === 0 ? (
          <Text>No enquiries found.</Text>
        ) : (
          <VStack spacing={4} align="stretch">
            {enquiries.map((enquiry) => (
              <Box key={enquiry.id} p={4} borderWidth="1px" borderRadius="lg" boxShadow="sm">
                <HStack justify="space-between">
                  <HStack>
                    <Image src={enquiry.product_image} boxSize="50px" borderRadius="md" alt={enquiry.product_name} />
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="bold">{enquiry.product_name}</Text>
                      <Text>Quantity: {enquiry.quantity}</Text>
                    </VStack>
                  </HStack>
                  <VStack align="end">
                    <Text>Status: {enquiry.status}</Text>
                    <Text>Created On: {new Date(enquiry.created_at).toLocaleString()}</Text>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Flex>
  );
};

export default BuyerEnquiry;

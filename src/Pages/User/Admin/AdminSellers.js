import { useState, useEffect } from "react";
import {
  Box, Button, HStack, Text, Flex, Menu, MenuItem, MenuButton, MenuList,
  VStack, useToast, Collapse
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import apiClient from "../Auth/AxiosInstance";

const Sidebar = ({ selected, onSelect }) => {
  const navigate = useNavigate();
  const menuItems = [
    { label: "Sellers", path: "/admin/home" },
    { label: "buyers", path: "/admin/buyers" },
   
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

const Adminsellers = () => {
  const [sellers, setSellers] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const toast = useToast();

  useEffect(() => {
   
    fetchSellers();
  }, [toast]);
  const fetchSellers = async () => {
    try {
      const response = await apiClient.get("api/users/seller/");
      setSellers(response.data);
    } catch (error) {
      toast({
        title: "Error fetching sellers",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleUpdateStatus = async (userId) => {
    try {
      await apiClient.delete(`/api/user/delete/${userId}/`);
      setSellers(sellers.map(seller => seller.id === userId ? { ...seller, is_active: !seller.is_active } : seller));
      toast({
        title: "User status updated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error updating status",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex h="100vh" bg="white" color="black">
      <Sidebar selected="Sellers" onSelect={() => {}} />
      <Box flex="1" p={6} overflowY="auto">
        <Flex justify="space-between" mb={4}>
          <Text fontSize="2xl" fontWeight="bold">Sellers List</Text>
          <Menu>
            <MenuButton as={Button} colorScheme="blue">Profile</MenuButton>
            <MenuList>
              <MenuItem>View Profile</MenuItem>
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        {sellers.length === 0 ? (
          <Text>No sellers found.</Text>
        ) : (
          <VStack spacing={4} align="stretch">
            {sellers.map((seller) => (
              <Box key={seller.username} p={4} borderWidth="1px" borderRadius="lg" boxShadow="sm">
                <HStack justify="space-between">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">{seller.username}</Text>
                    <Text>Email: {seller.email}</Text>
                    <Text>Phone: {seller.phone_number}</Text>
                    <Text>Pincode: {seller.pincode}</Text>
                    <Text>Status: {seller.is_active ? "Active" : "Inactive"}</Text>
                    <Button size="sm" mt={2} onClick={() => setExpanded(expanded === seller.username ? null : seller.username)}>
                      {expanded === seller.username ? "Hide Details" : "View More"}
                    </Button>
                  </VStack>
                  {expanded === seller.username && (
                    <Collapse in={expanded === seller.username} animateOpacity>
                      <Box mt={4} p={3} borderWidth="1px" borderRadius="md" bg="gray.50">
                        <Text>District: {seller.district}</Text>
                        <Text>Location: {seller.location}</Text>
                        <Text>Date of Birth: {seller.date_of_birth}</Text>
                        <Text>Company Name: {seller.company_name}</Text>
                        <Text>Company Address: {seller.company_address}</Text>
                        <Text>GSTIN: {seller.gstin}</Text>
                        <Text>Language: {seller.language}</Text>
                        <Button colorScheme="red" size="sm" mt={2} onClick={() => handleUpdateStatus(seller.id)}>
                          Update Status
                        </Button>
                      </Box>
                    </Collapse>
                  )}
                </HStack>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Flex>
  );
};

export default Adminsellers;

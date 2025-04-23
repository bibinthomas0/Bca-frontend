import { useState, useEffect } from "react";
import {
  Box, Button, HStack, Text, Flex, Menu, MenuItem, MenuButton, MenuList,
  VStack, useToast, Image
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import apiClient from "../Auth/AxiosInstance";

const Navbar = () => (
  <Flex bg="white"  align="center">
    <Image src="https://i.ibb.co/kVPZT0DB/Screenshot-2025-03-16-033115.png" alt="Logo" boxSize="350px" />
  </Flex>
);

const Sidebar = ({ selected, onSelect }) => {
    const navigate = useNavigate();
    const menuItems = [
      { label: "See Orders", path: "/seller/home" },
      { label: "Product Listing", path: "/seller/product" },
      { label: "Enquiries", path: "/seller/enquiries" },
      { label: "Help & Support", path: "/seller/help" },
    ];

    const handleSelect = (item) => {
      onSelect(item.label);
      navigate(item.path);
    };

    return (
      <VStack w="250px" bg="gray" h="100vh" p={4} spacing={6} align="stretch">
         <Text fontSize="2xl"  my={6}>SELLER</Text>
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

const SellerEnquiry = () => {
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

  const handleStatusChange = async (id, status) => {
    try {
      await apiClient.put(`/api/enquiries/${id}/status/`, { status });
      setEnquiries((prevEnquiries) =>
        prevEnquiries.map((enquiry) =>
          enquiry.id === id ? { ...enquiry, status } : enquiry
        )
      );
      toast({
        title: `Enquiry ${status}`,
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
    <Box>
      {/* <Navbar /> */}
      <Flex h="calc(100vh - 64px)" bg="white" color="black">
        <Sidebar selected={selected} onSelect={setSelected} />
        <Box flex="1" p={6} overflowY="auto">
          <Flex justify="space-between" mb={4} bg="gray" p={6}>
            <Text fontSize="2xl" fontWeight="bold">My Enquiries</Text>
            <Menu>
              <MenuButton as={Button} colorScheme="blue">Profile</MenuButton>
              <MenuList>
                <MenuItem  onClick={() => navigate("/seller/profile")}> View Profile</MenuItem>
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
                      {enquiry.status === "Pending" && (
                        <HStack>
                          <Button colorScheme="green" size="sm" onClick={() => handleStatusChange(enquiry.id, "Accepted")}>Accept</Button>
                          <Button colorScheme="red" size="sm" onClick={() => handleStatusChange(enquiry.id, "Rejected")}>Reject</Button>
                        </HStack>
                      )}
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default SellerEnquiry;

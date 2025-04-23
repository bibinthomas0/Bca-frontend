import { useState, useEffect } from "react";
import {
  Box, Button, HStack, Text, Flex, Menu, MenuItem, MenuButton, MenuList,
  VStack, useToast, Collapse
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import apiClient from "../Auth/AxiosInstance";


const RejectUser = ({ email }) => {
  const [reason, setReason] = useState("");
  const [showInput, setShowInput] = useState(false);
  const toast = useToast();

  const handleReject = async () => {
    if (!reason.trim()) {
      toast({
        title: "Reason required",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await apiClient.post("/api/send-email/", {
        message: reason,
        user_email: email,
      });

      toast({
        title: "Rejection email sent",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setShowInput(false);
      setReason("");
    } catch (error) {
      toast({
        title: "Failed to send email",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack align="stretch" spacing={2}>
      {!showInput ? (
        <Button colorScheme="red" size="sm" onClick={() => setShowInput(true)}>
          Reject user permanently
        </Button>
      ) : (
        <>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter rejection reason"
            rows="3"
            style={{ width: "100%", borderRadius: "8px", padding: "8px", border: "1px solid #ccc" }}
          />
          <Button colorScheme="red" size="sm" onClick={handleReject}>
            Send Rejection Email
          </Button>
        </>
      )}
    </VStack>
  );
};


const Sidebar = ({ selected, onSelect }) => {
  const navigate = useNavigate();
  const menuItems = [
    { label: "Sellers", path: "/admin/home" },
    { label: "Buyers", path: "/admin/buyers" },
    {label: "Help and Support", path: "/admin/help" },  
   
  ];

  const handleSelect = (item) => {
    onSelect(item.label);
    navigate(item.path);
  };

  return (
    <VStack w="250px" bg="beige" h="100vh" p={4} spacing={6} align="stretch">
        <Text fontSize="2xl"  my={6}>ADMIN</Text>
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
  const navigate = useNavigate();

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
          <Button as={Button}   onClick={() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/"); 
  }} colorScheme="blue">Logout</Button>
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
         
               {seller.email_verified === false && seller.is_active == false  ? (
                 <VStack mt={3} align="stretch" spacing={2}>
                   <Button colorScheme="green" size="sm" onClick={() => handleUpdateStatus(seller.id)}>
                     Accept
                   </Button>
         
                   <RejectUser email={seller.email} />
                 </VStack>
               ) : (
                <Button
                colorScheme={
                  seller.email_verified
                    ? "gray"
                    : seller.is_active
                    ? "red"
                    : "green"
                }
                size="sm"
                mt={2}
                onClick={() => handleUpdateStatus(seller.id)}
                isDisabled={seller.email_verified}
              >
                {seller.email_verified
                  ? "Rejected"
                  : seller.is_active
                  ? "Deactivate"
                  : "Activate"}
              </Button>
              
               )}
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

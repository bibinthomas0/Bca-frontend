import { useState, useEffect } from "react";
import { 
  Box, Button, HStack, Text, Modal, ModalOverlay, ModalContent, Flex, Menu, MenuItem, MenuButton, MenuList,
  ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Select, VStack, useDisclosure, Image,useToast
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import apiClient from "../Auth/AxiosInstance"

const Sidebar = ({ selected, onSelect }) => {
  const navigate = useNavigate();
  const menuItems = [
    { label: "See Orders", path: "/seller/home" },
    { label: "Product Listing", path: "/seller/product" },
    { label: "Enquiries", path: "/seller/enquiries" },
  ];

  const handleSelect = (item) => {
    onSelect(item.label);
    navigate(item.path);
  };

  return (
    <VStack w="250px" bg="white" h="100vh" p={4} spacing={6} align="stretch">
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

const HomePage = () => {
  const [selected, setSelected] = useState("See Orders");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
 const toast = useToast();
 
  useEffect(() => {
    fetchorders()
  }, []);


const fetchorders = () =>{
  apiClient.get("/api/seller/orders/")
  .then(response => setOrders(response.data))
  .catch(error => console.error("Error fetching orders:", error));
}

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const updateOrderStatus = (orderItemId) => {
    apiClient.patch(`/api/order-items/${orderItemId}/update-status/`, { status: selectedStatus })
      .then(response => {
        toast({ title: "Status updated successfully", status: "success" });
        fetchorders();
        onClose();
      })
      .catch(error =>{
        toast({ title: "Error in cancelling", status: "error" });

      })
  };

  return (
    <Flex h="100vh" bg="white" color="black">
      <Sidebar selected={selected} onSelect={setSelected} />

      <Box flex="1" p={6}>
        <Flex justify="flex-end" mb={4}>
          <Menu>
            <MenuButton as={Button} colorScheme="blue">Profile</MenuButton>
            <MenuList>
              <MenuItem>View Profile</MenuItem>
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        <Text fontSize="2xl" mb={6}>Orders</Text>

        <VStack spacing={4} align="stretch">
          {orders.map((order) => (
            <HStack
              key={order.id}
              p={4}
              borderWidth="1px"
              borderRadius="lg"
              justify="space-between"
            >
               <Image boxSize="50px" src={order.product_image}  />
              <Text>Buyer: {order.buyer_name}</Text>
              <Text>{order.status}</Text>
              <Text>{new Date(order.created_at).toLocaleString()}</Text>
              <Button colorScheme="blue" onClick={() => handleViewOrder(order)}>
                View Order
              </Button>
            </HStack>
          ))}
        </VStack>

        {selectedOrder && (
           <Modal isOpen={isOpen} onClose={onClose}>
           <ModalOverlay />
           <ModalContent>
             <ModalHeader>Order Details</ModalHeader>
             <ModalCloseButton />
             <ModalBody>
               <Box p={4} borderWidth="1px" borderRadius="md" w="full">
                 <Image src={selectedOrder.product_image} alt={selectedOrder.product_name} boxSize="100px" />
                 <Text fontWeight="bold">{selectedOrder.product_name}</Text>
                 <Text>Quantity: {selectedOrder.quantity}</Text>
                 <Text>Total Price: ₹{selectedOrder.order_item_total_price}</Text>
                 <Text>Total Price: ₹{selectedOrder.status}</Text>
                 <Select placeholder="Update Status" onChange={handleStatusChange}>
                   <option value="Cancelled">Cancelled</option>
                   <option value="Shipped">Shipped</option>
                   <option value="Out For Delivery">Out For Delivery</option>
                   <option value="Delivered">Delivered</option>
                 </Select>
                 <Button mt={2} colorScheme="green" onClick={() => updateOrderStatus(selectedOrder.id)}>
                   Update Order Status
                 </Button>
               </Box>
             </ModalBody>
             <ModalFooter>
               <Button colorScheme="red" onClick={onClose}>Close</Button>
             </ModalFooter>
           </ModalContent>
         </Modal>
        )}
      </Box>
    </Flex>
  );
};

export default HomePage;

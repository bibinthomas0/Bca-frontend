import { useState, useEffect } from "react";
import { 
  Box, Button, HStack, Text, Modal, ModalOverlay, ModalContent, Flex, Menu, MenuItem, MenuButton, MenuList,
  ModalHeader, ModalCloseButton, ModalBody, ModalFooter, VStack, useDisclosure, Image, useToast
} from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import apiClient from '../Auth/AxiosInstance';

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

const BuyerOrders = () => {
  const [selected, setSelected] = useState("My Orders");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItemToCancel, setOrderItemToCancel] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get("/api/buyer/orders/")
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => console.error("Error fetching orders:", error));
  }, []);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    onOpen();
  };

  const handleConfirmCancel = (orderItem) => {
    setOrderItemToCancel(orderItem);
    onConfirmOpen();
  };

  const handleCancelItem = () => {
    if (!orderItemToCancel) return;

    apiClient.patch(`/api/order-item/${orderItemToCancel.id}/update-status/`, { status: "Cancelled" })
      .then(response => {
        toast({
          title: "Item Cancelled",
          description: "The item has been successfully cancelled.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setOrders(prevOrders => prevOrders.map(order => {
          if (order.order_id === selectedOrder.order_id) {
            return {
              ...order,
              orderitems: order.orderitems.map(item => 
                item.product_name === orderItemToCancel.product_name ? { ...item, status: "Cancelled" } : item
              )
            };
          }
          return order;
        }));
      })
      .catch(error =>{
        toast({
          title: "Item cant be cancelled",
          description: "",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
      onConfirmClose();
  };

  return (
    <Flex h="100vh" bg="white" color="black">
      <Sidebar selected={selected} onSelect={setSelected} />
      <Box flex="1" p={6}>
        <Flex justify="space-between" mb={4}>
          <Text fontSize="2xl">My Orders</Text>
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

        <VStack spacing={4} align="stretch">
          {orders.length > 0 && orders.map((order) => (
            <Box key={order.order_id} p={4} borderWidth="1px" borderRadius="lg">
              <HStack justify="space-between">
                <Text>Order ID: {order.order_id}</Text>
                <Text>Created On: {new Date(order.created_at).toLocaleString()}</Text>
                <Text>Total: ₹{order.order_total}</Text>
                <Button colorScheme="blue" onClick={() => handleViewOrder(order)}>
                  View Details
                </Button>
              </HStack>

              {selectedOrder?.order_id === order.order_id && (
                <VStack mt={4} spacing={3} align="stretch">
                  {order.orderitems.map((item, index) => (
                    <HStack key={index} p={3} borderWidth="1px" borderRadius="md" justify="space-between">
                      <Image boxSize="50px" src={item.product_image} alt={item.product_name} />
                      <Text>{item.product_name}</Text>
                      <Text>Seller: {item.seller_name}</Text>
                      <Text>Status: {item.status}</Text>
                      <Text>₹{item.order_item_total_price}</Text>
                      {item.status !== "Cancelled" && (
                        <Button colorScheme="red" onClick={() => handleConfirmCancel(item)}>
                          Cancel Order
                        </Button>
                      )}
                    </HStack>
                  ))}
                </VStack>
              )}
            </Box>
          ))}
        </VStack>
      </Box>
      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Cancellation</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to cancel this item?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleCancelItem}>Yes, Cancel</Button>
            <Button variant="ghost" onClick={onConfirmClose}>No</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default BuyerOrders;

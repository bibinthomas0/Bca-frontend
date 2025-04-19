import { useState, useEffect } from "react";
import { 
  Box, Button, HStack, Image, Text, Flex,Input,Stack,Radio,RadioGroup, VStack, Menu, MenuItem, MenuButton, MenuList, useToast,useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import apiClient from '../Auth/AxiosInstance';

const Sidebar = ({ selected, onSelect }) => {
  const navigate = useNavigate();
  const menuItems = [
    { label: "Products", path: "/buyer/home" },
    { label: "My Orders", path: "/buyer/orders" },
    { label: "My Cart", path: "/buyer/cart" },
    { label: "Enquiries", path: "/buyer/enquiries" },
    { label: "Help & Support", path: "/buyer/support" },
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

const BuyerCart = () => {
  const [selected, setSelected] = useState("My Cart");
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [paymentDetails, setPaymentDetails] = useState({});
  
  useEffect(() => {


    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await apiClient.get("/api/cart/");
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const response = await apiClient.put("/api/cart/update/", { product: productId, quantity: newQuantity });
      setCart((prevCart) => {
        const updatedProducts = prevCart.cart_products.map((item) =>
          item.product === productId ? { ...item, quantity: newQuantity } : item
        );
        return { ...prevCart, cart_products: updatedProducts };
      });
      toast({ title: response.data.message, status: "success", duration: 3000, isClosable: true });
      fetchCart();
    } catch (error) {
      toast({ title: error.response?.data?.error || "Error updating quantity", status: "error", duration: 3000, isClosable: true });
    }
  };

  const removeItem = async (productId) => {
    try {
      await apiClient.delete("/api/cart/delete/", { data: { product: productId } });
      setCart((prevCart) => {
        const updatedProducts = prevCart.cart_products.filter(
          (item) => item.product !== productId
        );
        return { ...prevCart, cart_products: updatedProducts };
      });
      toast({ title: "Product removed from cart", status: "success", duration: 3000, isClosable: true });
      fetchCart();
    } catch (error) {
      toast({ title: error.response?.data?.error || "Error removing item", status: "error", duration: 3000, isClosable: true });
    }
  };

  
  const createOrder = async () => {
    try {
      const response = await apiClient.post("/api/order/create/");
      toast({ title: response.data.message, status: "success", duration: 3000, isClosable: true });
      fetchCart();
      onClose()
    } catch (error) {
      toast({ title: error.response?.data?.error || "Error creating order", status: "error", duration: 3000, isClosable: true });
    }
  };

  return (
    <Flex h="100vh" bg="white" color="black">
      <Sidebar selected={selected} onSelect={setSelected} />

      {(!cart || cart.cart_products.length === 0) ? (
        <Flex flex="1" align="center" justify="center" direction="column">
          <Text fontSize="2xl">Your cart is empty</Text>
          <Button mt={4} colorScheme="blue" onClick={() => navigate("/buyer/home")}>
            Add Products
          </Button>
        </Flex>
      ) : (
        <Box flex="1" p={6}>
          <Flex justify="flex-end" mb={4}>
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

          <Text fontSize="2xl" mb={6}>Your Cart</Text>

          <VStack spacing={4} align="stretch">
            {cart.cart_products.map((item) => (
              <HStack key={item.id} p={4} borderWidth="1px" borderRadius="lg" justify="space-between">
                <Image boxSize="50px" src={item.product_image} alt={item.product} />
                <Text> {item.product_name}</Text>
                <Text>Quantity: {item.quantity}</Text>
                <Text>Total: ${item.total_price.toFixed(2)}</Text>
                <Button onClick={() => updateQuantity(item.product, item.quantity + 1)}>+</Button>
                <Button onClick={() => item.quantity > 1 && updateQuantity(item.product, item.quantity - 1)}>-</Button>
                <Button colorScheme="red" onClick={() => removeItem(item.product)}>Remove</Button>
              </HStack>
            ))}
          </VStack>

          <Text fontSize="xl" mt={8}>Total: ${cart.total_cart_value.toFixed(2)}</Text>
          <Flex justify="flex-end">
      <Button colorScheme="green" mt={10} onClick={onOpen}>Create Order</Button>

            </Flex>

        </Box>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Image src="https://i.ibb.co/kVPZT0DB/Screenshot-2025-03-16-033115.png" alt="Logo" mb={4} />
            Select Payment Method
          </ModalHeader>
          <ModalBody>
            <RadioGroup onChange={setPaymentMethod} value={paymentMethod}>
              <Stack spacing={4}>
                <Radio value="upi">UPI</Radio>
                <Radio value="bank_transfer">Bank Transfer</Radio>
                <Radio value="card">Card</Radio>
              </Stack>
            </RadioGroup>
            
            {paymentMethod === "upi" && (
              <Input mt={4} placeholder="Enter UPI ID" onChange={(e) => setPaymentDetails({ ...paymentDetails, upi: e.target.value })} />
            )}
            {paymentMethod === "bank_transfer" && (
              <>
                <Input mt={4} placeholder="Account Number" onChange={(e) => setPaymentDetails({ ...paymentDetails, accountNumber: e.target.value })} />
                <Input mt={2} placeholder="IFSC Code" onChange={(e) => setPaymentDetails({ ...paymentDetails, ifsc: e.target.value })} />
              </>
            )}
            {paymentMethod === "card" && (
              <>
                <Input mt={4} placeholder="Card Number" onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })} />
                <Input mt={2} placeholder="Expiry Date" onChange={(e) => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })} />
                <Input mt={2} placeholder="CVV" type="password" onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })} />
              </>
            )}
            
            <Text fontSize="lg" fontWeight="bold" mt={4}>Total: ${cart?.total_cart_value.toFixed(2)}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" onClick={createOrder}>Create Payment</Button>
            <Button ml={3} onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default BuyerCart;

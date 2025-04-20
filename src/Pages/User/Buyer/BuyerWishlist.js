import { useEffect, useState } from "react";
import {
  Box, Button, Flex, Image, Text, VStack, HStack, useToast, Menu, MenuButton, MenuList, MenuItem
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import apiClient from "../Auth/AxiosInstance";

// Sidebar component (same as your Orders page)
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

const BuyerWishlist = () => {
  const [selected, setSelected] = useState("My Wishlist");
  const [wishlist, setWishlist] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await apiClient.get("/api/wishlist/");
      setWishlist(response.data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await apiClient.post("/api/wishlist/", { product: productId });
      setWishlist(prev => prev.filter(item => item.product.id !== productId));
      toast({
        title: "Removed from wishlist",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error removing from wishlist",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const addToCart = async (product) => {
    if (product.stock === 0) return;

    try {
      await apiClient.put("/api/cart/update/", {
        product: product.id,
        quantity: 1
      });

      // Remove from wishlist after adding to cart
      await removeFromWishlist(product.id);

      toast({
        title: "Added to cart",
        description: "You can update quantity in your cart.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

    } catch (error) {
      toast({
        title: error.response?.data?.error || "Error adding to cart",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex h="100vh" bg="white" color="black">
      <Sidebar selected={selected} onSelect={setSelected} />

      <Box flex="1" p={6}>
        <Flex justify="space-between" mb={4}>
          <Text fontSize="2xl">My Wishlist</Text>
          <Menu>
            <MenuButton as={Button} colorScheme="blue">
              Profile
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate("/buyer/profile")}>View Profile</MenuItem>
              <MenuItem onClick={() => {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                navigate("/");
              }}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>

        <VStack spacing={4} align="stretch">
          {wishlist.length === 0 ? (
            <Text>No items in wishlist.</Text>
          ) : (
            wishlist.map(({ id, product }) => (
              <Flex
                key={id}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                align="center"
                justify="space-between"
              >
                <HStack>
                  <Image boxSize="60px" src={product.image} alt={product.title} />
                  <Box>
                    <Text fontWeight="bold">{product.title}</Text>
                    <Text color="gray.500">₹{product.price}</Text>
                    {product.stock === 0 && (
                      <Text color="red.500" fontWeight="semibold">Out of Stock</Text>
                    )}
                  </Box>
                </HStack>
                <HStack spacing={3}>
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => addToCart(product)}
                    isDisabled={product.stock === 0}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    colorScheme="red"
                    size="sm"
                    variant="outline"
                    onClick={() => removeFromWishlist(product.id)}
                  >
                    Remove
                  </Button>
                </HStack>
              </Flex>
            ))
          )}
        </VStack>
      </Box>
    </Flex>
  );
};

export default BuyerWishlist;

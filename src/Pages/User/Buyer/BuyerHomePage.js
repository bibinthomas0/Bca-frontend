import { useState, useEffect } from "react";
import { 
  Box, Button, Text, Flex,Menu,MenuItem,MenuButton,MenuList, VStack,Card, CardHeader, CardBody, CardFooter,Image,Stack,Heading,Divider,ButtonGroup,Input,IconButton,Badge
} from "@chakra-ui/react";
import { Heart } from 'lucide-react';
import {
    Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast
} from '@chakra-ui/react';
import { useNavigate } from "react-router-dom";
import apiClient from '../Auth/AxiosInstance'
import { SearchIcon
 } from "@chakra-ui/icons";
import { ShoppingCart } from 'lucide-react';

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




const BuyerHomePage = () => {
    const [enquiryQuantity, setEnquiryQuantity] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const [selected, setSelected] = useState("Products");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [cartCount, setCartCount] = useState(0);
    const [wishlist, setWishlist] = useState([]);
    const navigate = useNavigate();

  useEffect(() => {
 

    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      const response = await apiClient.get("/api/products/");
      setProducts(response.data);
    } catch (err) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = () => {
    if (!searchTerm) {
      fetchProducts() 
    } else {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setProducts(filtered)
    }
  };
  const handleCreateEnquiry = async () => {
    try {
      await apiClient.post("/api/enquiries/", {
        product: selectedProduct.id,
        quantity: enquiryQuantity,
      });
      toast({ title: "Enquiry created successfully", status: "success" });
      onClose();
    } catch (error) {
      toast({ title: "Failed to create enquiry", status: "error" });
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await apiClient.get("/api/categories/");
      setCategories(response.data);
    } catch (error) {
      toast({ title: "Failed to load categories", status: "error" });
    }
  };
  
  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  const handleAddToCart = async (product) => {
    try {
      await apiClient.put("/api/cart/update/", { product: product.id, quantity: 1 });
      setCartCount(cartCount + 1);
      toast({ title: "Product added to cart. Please update quantity in the cart", status: "success", duration: 2000 });
    } catch (error) {
      toast({ title: error.response?.data?.error || "Error adding to cart", status: "error" });
    }
  };
  const AddtoWishlist = async (productId) => { 
    try {
      await apiClient.post("/api/wishlist/", { product: productId });
      setWishlist((prev) => [...prev, productId]);
  
      toast({
        title: "Added to wishlist", 
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error adding to wishlist", 
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  
  
    const filteredProducts = selectedCategory === 'all'
      ? products
      : products.filter(product => product.category_name.toLowerCase() === selectedCategory);
  
    return (
        <Flex minH="100vh" bg="white" color="black" overflow="hidden">
        <Sidebar selected={selected} onSelect={setSelected} />
  
        <Flex direction="column" flex="1">
          <Flex justify="space-between" p={4} backgroundColor={"beige"} position="sticky" top={0} zIndex={1}>
          <Select
  placeholder="Select Category"
  maxW="250px"
  bg="white"
  border="1px solid"
  borderColor="gray.300"
  borderRadius="md"
  boxShadow="sm"
  _hover={{ borderColor: "blue.400" }}
  _focus={{ borderColor: "blue.500", boxShadow: "outline" }}
  fontSize="md"
  p={2}
  onChange={(e) => setSelectedCategory(e.target.value)}
>
<option key={"all"} value={"all"}>
      All
    </option>
  {categories.map((category) => (
    <option key={category.id} value={category.name.toLowerCase()}>
      {category.name}
    </option>
  ))}
</Select>

<Flex>
            <Input placeholder="Search products" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} onInput={handleSearch} />
            <IconButton icon={<SearchIcon />} onClick={handleSearch} />
          </Flex>
  <Flex>
  <Box position="relative" display="inline-block">
      <IconButton
        icon={<ShoppingCart />}
        onClick={() => navigate("/buyer/cart")}
        aria-label="Cart"
      />
      {cartCount > 0 && (
        <Badge
          colorScheme="red"
          borderRadius="full"
          position="absolute"
          top="-1"
          right="-1"
          fontSize="0.8em"
        >
          {cartCount}
        </Badge>
      )}
    </Box>
  </Flex>
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
  
          <Text fontSize="2xl" textAlign="center" my={6}>Products</Text>
  
          <Box overflowY="auto" flex={1} p={4} maxH="calc(100vh - 150px)">
            <Flex wrap="wrap" justify="center" gap={6}>
              {filteredProducts.map((product) => (
                <Card key={product.id} maxW="sm" boxShadow="md" backgroundColor={"beige"}>
                  <CardBody>
                    <Image
                      src={product.image}
                      alt={product.title}
                      borderRadius="lg"
                    />
                    <Stack mt={4} spacing={3}>
                      <Heading size="md">{product.title}</Heading>
                      <Text>{product.description}</Text>
                      <Text color="blue.600" fontSize="2xl">${product.price}</Text>
                    </Stack>
                  </CardBody>
                  <Divider />
                  <CardFooter justifyContent="space-between" alignItems="center">
  <ButtonGroup spacing={4}>
    <Button colorScheme="green" onClick={() => handleAddToCart(product)} isDisabled={product.stock === 0}>
      {product.stock === 0 ? "Out of Stock" : "Add to cart"}
    </Button>
    <Button colorScheme="blue" onClick={() => {
      setSelectedProduct(product);
      onOpen();
    }}>
      View More Details
    </Button>
  </ButtonGroup>

  <IconButton
  icon={<Heart fill={wishlist.includes(product.id) ? "red" : "none"} color="red" />}
  variant="ghost"
  aria-label="Add to Wishlist"
  onClick={() => {
    if (!wishlist.includes(product.id)) {
      AddtoWishlist(product.id);
    }
  }}
/>

</CardFooter>

                </Card>
              ))}
            </Flex>
          </Box>
  
          {selectedProduct && (
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>{selectedProduct.title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    borderRadius="lg"
                    mb={4}
                  />
                  <Text><strong>Seller:</strong> {selectedProduct.seller}</Text>
                  <Text><strong>Stock:</strong> {selectedProduct.stock}</Text>
                  <Text color="red.600" fontSize="2x">NB - They payment will be collected when the product is delivered.</Text>
                  <Input
        type="number"
        placeholder="Enter quantity for enqiury"
        value={enquiryQuantity}
        onChange={(e) => setEnquiryQuantity(e.target.value)}
        min={1}
        mt={4}
      />
                </ModalBody>
                <ModalFooter>
                {/* <Button colorScheme="green" onClick={() => handleAddToCart(selectedProduct)} isDisabled={selectedProduct.stock === 0}>
                    {selectedProduct.stock === 0 ? "Out of Stock" : "Add to cart"}
                  </Button> */}
                  <Button colorScheme="blue" onClick={handleCreateEnquiry} ml={3}>
        Create Enquiry
      </Button>
                  <Button ml={3} onClick={onClose}>Close</Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          )}
        </Flex>
      </Flex>
    );
  };
  
  export default BuyerHomePage;
  
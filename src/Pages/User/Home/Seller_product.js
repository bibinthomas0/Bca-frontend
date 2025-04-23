import {
  Box,
  Button,
  Flex,
  Text,
  VStack,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
} from "@chakra-ui/react";
import { useState,useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import apiClient from "../Auth/AxiosInstance"

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



const SellerProduct = () => {
const REACT_APP_CLOUDINARY_CLOUD_NAME = "dvlpq6zex";
const REACT_APP_CLOUDINARY_API_KEY = "819793121816654";
const REACT_APP_CLOUDINARY_API_SECRET = "o7jvARVAcbb9LCVt2VWz4SDlW7w";
const REACT_APP_CLOUDINARY_UPLOAD_PRESET = "pafqnehk";
  const [selected, setSelected] = useState("Product Listing");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateProduct, setUpdateProduct] = useState(null);
  const [image, setImage] = useState(null);
  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    image: "",
  });

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get("/api/categories/");
      setCategories(response.data);
    } catch (error) {
      toast({ title: "Failed to load categories", status: "error" });
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get("/api/products/");
      setProducts(response.data);
      console.log(response.data)
    } catch (error) {
      toast({ title: "Failed to load products", status: "error" });
    }
  };

  const addCategory = async () => {
    try {
      const response = await apiClient.post("/api/categories/", { name: categoryName });
      setCategories([...categories, response.data]);
      toast({ title: "Category added successfully", status: "success" });
      setIsCategoryModalOpen(false);
    } catch (error) {
      toast({ title: "Failed to add category", status: "error" });
    }
  };

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", REACT_APP_CLOUDINARY_UPLOAD_PRESET);
    data.append("cloud_name", REACT_APP_CLOUDINARY_CLOUD_NAME);
    data.append("folder", "Zorpia-posts");
  
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const res = await response.json();
      console.log(res.secure_url)
      return res.secure_url; // Return the uploaded image URL
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };
  
  const addProduct = async () => {


    try {
      if (!newProduct.title.trim()) {
        return toast({ title: "Title is required", status: "warning" });
      }
      if (!newProduct.description.trim()) {
        return toast({ title: "Description is required", status: "warning" });
      }
      if (!newProduct.price || isNaN(newProduct.price) || Number(newProduct.price) <= 0) {
        return toast({ title: "Price must be a valid number greater than 0", status: "warning" });
      }
      if (!newProduct.stock || isNaN(newProduct.stock) || Number(newProduct.stock) <= 0) {
        return toast({ title: "Stock must be a valid non-negative number", status: "warning" });
      }
      if (image) {
        const uploadedImageUrl = await uploadImage(image);
        if (uploadedImageUrl) {
          newProduct.image = uploadedImageUrl; 
        }
      }
  
      const response = await apiClient.post("/api/products/", newProduct);
      setProducts([...products, response.data]);
      toast({ title: "Product added successfully", status: "success" });
      setIsProductModalOpen(false);
    } catch (error) {
      toast({ title: "Failed to add product", status: "error" });
    }
  };

  const deleteProduct = async (id) => {
    try {
      await apiClient.delete(`/api/products/${id}/`);
      setProducts(products.filter((product) => product.id !== id));
      toast({ title: "Product deleted successfully", status: "success" });
      setIsViewModalOpen(false);
    } catch (error) {
      toast({ title: "Failed to delete product", status: "error" });
    }
  };

  const handleUpdateProduct = async () => {
    try {
      if (image) {
        const uploadedImageUrl = await uploadImage(image);
        if (uploadedImageUrl) {
          updateProduct.image = uploadedImageUrl; 
        }
      }
      await apiClient.put(`/api/products/${updateProduct.id}/`, updateProduct);
      fetchProducts();
      toast({ title: "Product updated successfully", status: "success" });
      setIsUpdateModalOpen(false);
    } catch (error) {
      toast({ title: "Failed to update product", status: "error" });
    }
  };

  return (
    <Flex h="100vh" bg="white" color="black">
    <Sidebar selected={selected} onSelect={setSelected} />

    <Box flex="1" p={6}>
      <Flex justify="space-between" p={6} mb={4} bg="gray">
        <Button colorScheme="blue" onClick={() => setIsCategoryModalOpen(true)}>
          Add Category
        </Button>
        <Button colorScheme="blue" onClick={() => setIsProductModalOpen(true)}>
          Add Product
        </Button>
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

      <Text fontSize="2xl" mb={6}>Products</Text>

      <VStack spacing={4} align="stretch">
        {products.map((product) => (
          <HStack key={product.id} p={4} borderWidth="1px" borderRadius="lg" justify="space-between">
            <Image boxSize="50px" src={product.image} alt={product.title} />
            <Text>{product.title}</Text>
            <Text>{product.category_name}</Text>
            <Text>{product.stock}</Text>
            <Text>${product.price}</Text>
            <Button colorScheme="blue" onClick={() => { setViewProduct(product); setIsViewModalOpen(true); }}>View More</Button>
            <Button colorScheme="green" onClick={() => { setUpdateProduct(product); setIsUpdateModalOpen(true); }}>Update</Button>
          </HStack>
        ))}
      </VStack>

      <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Category</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={addCategory}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Product</ModalHeader>
          <ModalBody>
            <Select placeholder="Select Category" onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </Select>
            <Input placeholder="Title" onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} />
            <Input placeholder="Description" onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
            <Input placeholder="Price" type="number" onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
            <Input placeholder="Stock" type="number" onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
            <Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={addProduct}>Add Product</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

   {/* View More Modal */}
   <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Product Details</ModalHeader>
            <ModalBody>
              {viewProduct && (
                <VStack spacing={4}>
                  <Image boxSize="100px" src={viewProduct.image} alt={viewProduct.title} />
                  <Text fontSize="lg">{viewProduct.title}</Text>
                  <Text>{viewProduct.description}</Text>
                  <Text>Stock: {viewProduct.stock}</Text>
                  <Text>Price: ${viewProduct.price}</Text>
                </VStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Update Product Modal */}
        <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Product</ModalHeader>
            <ModalBody>
              {updateProduct && (
                <VStack spacing={4}>
                  <Input placeholder="Title" value={updateProduct.title} onChange={(e) => setUpdateProduct({ ...updateProduct, title: e.target.value })} />
                  <Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                  <Input placeholder="Stock" type="number" value={updateProduct.stock} onChange={(e) => setUpdateProduct({ ...updateProduct, stock: e.target.value })} />
                  <Input placeholder="Price" type="number" value={updateProduct.price} onChange={(e) => setUpdateProduct({ ...updateProduct, price: e.target.value })} />
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" onClick={handleUpdateProduct}>Update</Button>
              <Button colorScheme="red" onClick={() => deleteProduct(updateProduct.id)}>Delete</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>


    </Box>
  </Flex>
  );
};

export default SellerProduct;
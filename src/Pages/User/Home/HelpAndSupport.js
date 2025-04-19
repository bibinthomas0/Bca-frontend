import { useState, useEffect } from "react";
import {
  Box, Button, HStack, Text, Flex, Menu, MenuItem, MenuButton, MenuList,
  VStack, useToast, Textarea, FormControl, FormErrorMessage
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import apiClient from "../Auth/AxiosInstance";

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

const HelpAndSupport = () => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [selected, setSelected] = useState("Help & Support");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await apiClient.get("/api/support/");
        setComments(response.data.data);
      } catch (error) {
        toast({
          title: "Error fetching comments",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    fetchComments();
  }, [toast]);

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await apiClient.post("/api/support/create/", {
        comment: commentText,
      });
      toast({
        title: "Comment submitted",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setComments([response.data.data, ...comments]);
      setCommentText("");
    } catch (error) {
      toast({
        title: "Failed to submit comment",
        description: error.response?.data?.errors?.comment?.[0] || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setIsSubmitting(false);
  };

  return (
    <Flex h="100vh" bg="white" color="black">
      <Sidebar selected={selected} onSelect={setSelected} />
      <Box flex="1" p={6} overflowY="auto">
        <Flex justify="space-between" mb={4}>
          <Text fontSize="2xl" fontWeight="bold">Help & Support</Text>
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

        <FormControl isInvalid={!commentText.trim()}>
          <Textarea
            placeholder="Enter your comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            mb={2}
          />
          <FormErrorMessage>Comment cannot be empty.</FormErrorMessage>
        </FormControl>
        <Button
          colorScheme="teal"
          onClick={handleCommentSubmit}
          isLoading={isSubmitting}
          isDisabled={!commentText.trim()}
          mb={6}
        >
          Submit
        </Button>

        <VStack spacing={4} align="stretch">
          {comments.length === 0 ? (
            <Text>No comments yet.</Text>
          ) : (
            comments.map((c) => (
              <Box key={c.id} p={4} borderWidth="1px" borderRadius="lg" boxShadow="sm">
                <Text fontWeight="bold">Comment:</Text>
                <Text mb={2}>{c.comment}</Text>
                {c.reply_comment && (
                  <>
                    <Text fontWeight="bold">Reply:</Text>
                    <Text color="green.600">{c.reply_comment}</Text>
                  </>
                )}
                <Text fontSize="sm" mt={2} color="gray.500">
                  {new Date(c.created_on).toLocaleString()}
                </Text>
              </Box>
            ))
          )}
        </VStack>
      </Box>
    </Flex>
  );
};

export default HelpAndSupport;

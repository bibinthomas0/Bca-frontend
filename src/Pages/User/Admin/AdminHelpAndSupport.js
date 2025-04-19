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

const AdminHelpAndSupport = () => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [replies, setReplies] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replySubmitting, setReplySubmitting] = useState({});
  const [selected, setSelected] = useState("Help & Support");
  const toast = useToast();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await apiClient.get("api/support/");
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
      const response = await apiClient.post("api/support/create/", {
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

  const handleReplyChange = (id, value) => {
    setReplies({ ...replies, [id]: value });
  };

  const handleReplySubmit = async (id) => {
    const replyText = replies[id];
    if (!replyText?.trim()) return;

    setReplySubmitting({ ...replySubmitting, [id]: true });
    try {
      const res = await apiClient.patch(`api/support/reply/${id}/`, {
        reply_comment: replyText,
      });
      toast({
        title: "Reply added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Update comment in UI
      setComments(comments.map((comment) =>
        comment.id === id ? { ...comment, reply_comment: res.data.data.reply_comment } : comment
      ));
      setReplies({ ...replies, [id]: "" });
    } catch (err) {
      toast({
        title: "Failed to add reply",
        description: err.response?.data?.errors?.reply_comment?.[0] || "Something went wrong.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setReplySubmitting({ ...replySubmitting, [id]: false });
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
              <MenuItem>View Profile</MenuItem>
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>

  
   

        <VStack spacing={4} align="stretch">
          {comments.length === 0 ? (
            <Text>No comments yet.</Text>
          ) : (
            comments.map((c) => (
              <Box key={c.id} p={4} borderWidth="1px" borderRadius="lg" boxShadow="sm">
                <Text fontWeight="bold">Comment:</Text>
                <Text mb={2}>{c.comment}</Text>

                {c.reply_comment ? (
                  <>
                    <Text fontWeight="bold">Reply:</Text>
                    <Text color="green.600">{c.reply_comment}</Text>
                  </>
                ) : (
                  <Box mt={2}>
                    <FormControl isInvalid={!replies[c.id]?.trim()}>
                      <Textarea
                        placeholder="Write a reply..."
                        value={replies[c.id] || ""}
                        onChange={(e) => handleReplyChange(c.id, e.target.value)}
                        mb={2}
                      />
                      <FormErrorMessage>Reply cannot be empty.</FormErrorMessage>
                    </FormControl>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleReplySubmit(c.id)}
                      isLoading={replySubmitting[c.id]}
                      isDisabled={!replies[c.id]?.trim()}
                    >
                      Submit Reply
                    </Button>
                  </Box>
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

export default AdminHelpAndSupport;

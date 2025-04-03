import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Link,
  Text,
  FormErrorMessage,
  Alert,
  AlertIcon,
  Radio,
  RadioGroup,
  InputGroup,
  InputRightElement,
  IconButton,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Heading,
  useColorModeValue,
  VStack,
  HStack,
  Divider,
  InputLeftAddon,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon, LockIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthContext";
import { RegisterRequest } from "../../types";
import { motion } from "framer-motion";

// Framer motion variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

// Create motion components
const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

// Register form validation schema
const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    ),
  role: z.enum(["USER", "INSTRUCTOR", "ADMIN"]),
  mobile: z.string().optional(),
  address: z.string().optional(),
  dob: z.string().optional(),
  adminCode: z
    .string()
    .optional()
    .refine(
      (val) => {
        // If role is ADMIN, then adminCode is required
        return val !== "" || val !== undefined;
      },
      {
        message: "Admin code is required for admin registration",
        path: ["adminCode"],
      }
    ),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  // Theme colors
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const headingColor = useColorModeValue("gray.800", "white");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const linkColor = useColorModeValue("purple.600", "purple.300");
  const tabBg = useColorModeValue("gray.50", "gray.700");
  const selectedTabBg = useColorModeValue("white", "gray.800");
  const tabBorderColor = useColorModeValue("gray.200", "gray.600");
  const dividerColor = useColorModeValue("gray.200", "gray.700");
  const adminBg = useColorModeValue("red.50", "red.900");
  const buttonBgGradient = "linear(to-r, purple.600, pink.500)";
  const buttonHoverBgGradient = "linear(to-r, purple.700, pink.600)";

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "USER",
    },
  });

  const selectedRole = watch("role");

  // Show the admin code input when the role is ADMIN
  const handleTabChange = (index: number) => {
    const role = index === 0 ? "USER" : index === 1 ? "INSTRUCTOR" : "ADMIN";
    setValue("role", role);
    setShowAdminCode(role === "ADMIN");
  };

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // If user is trying to register as an admin but admin code is missing
      if (
        data.role === "ADMIN" &&
        (!data.adminCode || data.adminCode.trim() === "")
      ) {
        setError("Admin code is required for admin registration");
        setIsLoading(false);
        return;
      }

      await registerUser(data as RegisterRequest);

      // Redirect based on user role
      switch (data.role) {
        case "ADMIN":
          navigate("/admin/dashboard");
          break;
        case "INSTRUCTOR":
          navigate("/instructor/dashboard");
          break;
        case "USER":
          navigate("/user/dashboard");
          break;
        default:
          navigate("/dashboard");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to register";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MotionBox
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      w="100%"
      mx="auto"
      maxW="550px"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <MotionBox
          variants={itemVariants}
          p={8}
          borderWidth="1px"
          borderRadius="lg"
          borderColor={borderColor}
          boxShadow="xl"
          bg={cardBg}
          transition="all 0.3s ease"
          _hover={{ boxShadow: "2xl", transform: "translateY(-5px)" }}
        >
          <MotionVStack spacing={6} variants={containerVariants}>
            <MotionBox variants={itemVariants} textAlign="center" width="100%">
              <Heading
                as="h1"
                size="xl"
                color={headingColor}
                letterSpacing="tight"
                mb={1}
              >
                Create Your Account
              </Heading>
              <Text fontSize="md" color={textColor}>
                Join FitBook to start your fitness journey
              </Text>
            </MotionBox>

            <MotionBox variants={itemVariants} width="100%">
              <Tabs
                isFitted
                colorScheme="purple"
                onChange={handleTabChange}
                variant="enclosed"
                borderColor={tabBorderColor}
              >
                <TabList mb={4}>
                  <Tab
                    _selected={{
                      color: "purple.600",
                      bg: selectedTabBg,
                      borderColor: tabBorderColor,
                      borderBottomColor: selectedTabBg,
                      fontWeight: "semibold",
                    }}
                    bg={tabBg}
                    borderBottomWidth="1px"
                    transition="all 0.2s"
                  >
                    Register as User
                  </Tab>
                  <Tab
                    _selected={{
                      color: "purple.600",
                      bg: selectedTabBg,
                      borderColor: tabBorderColor,
                      borderBottomColor: selectedTabBg,
                      fontWeight: "semibold",
                    }}
                    bg={tabBg}
                    borderBottomWidth="1px"
                    transition="all 0.2s"
                  >
                    Register as Instructor
                  </Tab>
                  <Tab
                    _selected={{
                      color: "red.600",
                      bg: selectedTabBg,
                      borderColor: tabBorderColor,
                      borderBottomColor: selectedTabBg,
                      fontWeight: "semibold",
                    }}
                    bg={tabBg}
                    borderBottomWidth="1px"
                    transition="all 0.2s"
                  >
                    Admin
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel p={0}>
                    <Text fontSize="md" mb={4} color={textColor}>
                      Sign up as a user to book and attend fitness classes.
                    </Text>
                  </TabPanel>
                  <TabPanel p={0}>
                    <Text fontSize="md" mb={4} color={textColor}>
                      Sign up as an instructor to manage and teach fitness
                      classes.
                    </Text>
                  </TabPanel>
                  <TabPanel p={0}>
                    <Box p={3} borderRadius="md" bg={adminBg} mb={4}>
                      <HStack spacing={2} mb={1}>
                        <LockIcon color="red.500" />
                        <Text fontWeight="medium" color="red.500">
                          Admin Registration
                        </Text>
                      </HStack>
                      <Text fontSize="sm" color={textColor}>
                        Admin registration requires an authorization code. Only
                        register as an admin if you have been authorized to do
                        so.
                      </Text>
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </MotionBox>

            {error && (
              <MotionBox variants={itemVariants} width="100%">
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  {error}
                </Alert>
              </MotionBox>
            )}

            <MotionBox variants={itemVariants} width="100%">
              <FormControl isInvalid={!!errors.name}>
                <FormLabel fontWeight="medium">Full Name</FormLabel>
                <Input
                  placeholder="John Doe"
                  size="lg"
                  borderRadius="md"
                  focusBorderColor="purple.400"
                  {...register("name")}
                />
                {errors.name && (
                  <FormErrorMessage>{errors.name.message}</FormErrorMessage>
                )}
              </FormControl>
            </MotionBox>

            <MotionBox variants={itemVariants} width="100%">
              <FormControl isInvalid={!!errors.email}>
                <FormLabel fontWeight="medium">Email address</FormLabel>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  size="lg"
                  borderRadius="md"
                  focusBorderColor="purple.400"
                  {...register("email")}
                />
                {errors.email && (
                  <FormErrorMessage>{errors.email.message}</FormErrorMessage>
                )}
              </FormControl>
            </MotionBox>

            <MotionBox variants={itemVariants} width="100%">
              <FormControl isInvalid={!!errors.password}>
                <FormLabel fontWeight="medium">Password</FormLabel>
                <InputGroup size="lg">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    focusBorderColor="purple.400"
                    borderRadius="md"
                    {...register("password")}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      size="sm"
                      color="gray.500"
                      _hover={{ color: "purple.500" }}
                    />
                  </InputRightElement>
                </InputGroup>
                {errors.password && (
                  <FormErrorMessage>{errors.password.message}</FormErrorMessage>
                )}
              </FormControl>
            </MotionBox>

            {showAdminCode && (
              <MotionBox variants={itemVariants} width="100%">
                <FormControl isInvalid={!!errors.adminCode}>
                  <FormLabel fontWeight="medium">
                    Admin Authorization Code
                  </FormLabel>
                  <InputGroup size="lg">
                    <InputLeftAddon children={<LockIcon color="red.500" />} />
                    <Input
                      type="password"
                      placeholder="Enter admin authorization code"
                      focusBorderColor="red.400"
                      borderRadius="md"
                      {...register("adminCode")}
                    />
                  </InputGroup>
                  {errors.adminCode && (
                    <FormErrorMessage>
                      {errors.adminCode.message}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </MotionBox>
            )}

            <Box display="none">
              <RadioGroup value={selectedRole}>
                <Radio value="USER" {...register("role")}>
                  User
                </Radio>
                <Radio value="INSTRUCTOR" {...register("role")}>
                  Instructor
                </Radio>
                <Radio value="ADMIN" {...register("role")}>
                  Admin
                </Radio>
              </RadioGroup>
            </Box>

            <MotionBox variants={itemVariants} width="100%">
              <Divider my={2} borderColor={dividerColor} />
              <Text fontWeight="medium" mb={3} mt={1} color={headingColor}>
                Optional Information
              </Text>
            </MotionBox>

            <MotionBox variants={itemVariants} width="100%">
              <FormControl isInvalid={!!errors.mobile}>
                <FormLabel fontWeight="medium">Mobile Number</FormLabel>
                <Input
                  placeholder="Your mobile number"
                  size="lg"
                  borderRadius="md"
                  focusBorderColor="purple.400"
                  {...register("mobile")}
                />
                {errors.mobile && (
                  <FormErrorMessage>{errors.mobile.message}</FormErrorMessage>
                )}
              </FormControl>
            </MotionBox>

            <MotionBox variants={itemVariants} width="100%">
              <FormControl isInvalid={!!errors.address}>
                <FormLabel fontWeight="medium">Address</FormLabel>
                <Input
                  placeholder="Your address"
                  size="lg"
                  borderRadius="md"
                  focusBorderColor="purple.400"
                  {...register("address")}
                />
                {errors.address && (
                  <FormErrorMessage>{errors.address.message}</FormErrorMessage>
                )}
              </FormControl>
            </MotionBox>

            <MotionBox variants={itemVariants} width="100%">
              <FormControl isInvalid={!!errors.dob}>
                <FormLabel fontWeight="medium">Date of Birth</FormLabel>
                <Input
                  type="date"
                  size="lg"
                  borderRadius="md"
                  focusBorderColor="purple.400"
                  {...register("dob")}
                />
                {errors.dob && (
                  <FormErrorMessage>{errors.dob.message}</FormErrorMessage>
                )}
              </FormControl>
            </MotionBox>

            <MotionBox variants={itemVariants} width="100%" mt={2}>
              <Button
                type="submit"
                w="100%"
                size="lg"
                isLoading={isLoading}
                bgGradient={
                  selectedRole === "ADMIN"
                    ? "linear(to-r, red.600, red.500)"
                    : buttonBgGradient
                }
                color="white"
                _hover={{
                  bgGradient:
                    selectedRole === "ADMIN"
                      ? "linear(to-r, red.700, red.600)"
                      : buttonHoverBgGradient,
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                _active={{
                  bgGradient:
                    selectedRole === "ADMIN"
                      ? "linear(to-r, red.700, red.600)"
                      : buttonHoverBgGradient,
                  transform: "translateY(0)",
                }}
                boxShadow="md"
                transition="all 0.3s ease"
              >
                Sign Up
              </Button>
            </MotionBox>

            <MotionBox variants={itemVariants} width="100%" textAlign="center">
              <Text color={textColor}>
                Already have an account?{" "}
                <Link
                  as={RouterLink}
                  to="/login"
                  color={linkColor}
                  fontWeight="semibold"
                  _hover={{
                    textDecoration: "none",
                    color: useColorModeValue("purple.700", "purple.200"),
                  }}
                >
                  Login Here
                </Link>
              </Text>
            </MotionBox>
          </MotionVStack>
        </MotionBox>
      </form>
    </MotionBox>
  );
};

export default Register;

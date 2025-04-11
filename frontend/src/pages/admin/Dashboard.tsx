import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Flex,
  Icon,
  useColorModeValue,
  VStack,
  HStack,
  Button,
  Card,
  CardBody,
  CardHeader,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Avatar,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Skeleton,
  useToast,
} from "@chakra-ui/react";
import {
  FaUsers,
  FaDumbbell,
  FaChartLine,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaCog,
  FaEllipsisV,
  FaExclamationCircle,
  FaCheckCircle,
  FaPencilAlt,
  FaStar,
  FaUsersCog,
  FaClipboardList,
  FaBell,
  FaExclamationTriangle,
  FaSync,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { Link as RouterLink } from "react-router-dom";
import { adminService } from "../../services/api";
import { User, FitnessClass } from "../../types";
import ErrorDisplay from "../../components/ErrorDisplay";
import * as toastUtils from "../../utils/toast";

// Create motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionSimpleGrid = motion(SimpleGrid);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

interface DashboardStats {
  totalUsers: number;
  activeClasses: number;
  revenue: number;
  growthRate: number;
  recentUsers: User[];
  popularClasses: FitnessClass[];
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardStats>({
    totalUsers: 0,
    activeClasses: 0,
    revenue: 0,
    growthRate: 0,
    recentUsers: [],
    popularClasses: [],
  });

  // Theme colors
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.800", "white");
  const statBg = useColorModeValue("purple.50", "purple.900");
  const tableBg = useColorModeValue("white", "gray.800");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.700");
  const tableRowHoverBg = useColorModeValue("gray.50", "gray.700");
  const greenBg = useColorModeValue("green.50", "green.900");
  const redBg = useColorModeValue("red.50", "red.900");
  const yellowBg = useColorModeValue("yellow.50", "yellow.900");
  const buttonBgGradient = "linear(to-r, purple.600, pink.500)";
  const buttonHoverBgGradient = "linear(to-r, purple.700, pink.600)";

  // Issues that need attention (static for now)
  const issuesNeedingAttention = [
    {
      id: 1,
      title: "Payment System Error",
      description: "Multiple users reporting payment failures",
      priority: "High",
      reported: "Aug 14, 2023",
    },
    {
      id: 2,
      title: "Booking System Lag",
      description: "System slow during peak hours",
      priority: "Medium",
      reported: "Aug 13, 2023",
    },
  ];

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // If the API endpoint isn't implemented yet, use mock data
      try {
        const response = await adminService.getDashboardStats();
        if (response.success) {
          setDashboardData(response.data);
        } else {
          throw new Error(response.message || "Failed to fetch dashboard data");
        }
      } catch (err) {
        console.warn("Using mock data - API endpoint not implemented", err);

        // Fallback to mock data if API call fails
        // In a production environment, you'd want to show the error instead
        setTimeout(() => {
          setDashboardData({
            totalUsers: 235,
            activeClasses: 21,
            revenue: 12850,
            growthRate: 18,
            recentUsers: [
              {
                id: "1",
                name: "John Doe",
                email: "john.doe@example.com",
                role: "INSTRUCTOR",
                createdAt: new Date("2023-08-15").toISOString(),
              },
              {
                id: "2",
                name: "Jane Smith",
                email: "jane.smith@example.com",
                role: "USER",
                createdAt: new Date("2023-08-10").toISOString(),
              },
              {
                id: "3",
                name: "Mike Johnson",
                email: "mike.j@example.com",
                role: "USER",
                createdAt: new Date("2023-08-08").toISOString(),
              },
              {
                id: "4",
                name: "Sarah Williams",
                email: "s.williams@example.com",
                role: "INSTRUCTOR",
                createdAt: new Date("2023-08-05").toISOString(),
              },
            ],
            popularClasses: [
              {
                id: "1",
                name: "Morning Yoga",
                instructor: { name: "Sarah Williams", id: "4" },
                category: { name: "Yoga", id: "1" },
                startsAt: new Date("2023-09-01T09:00:00").toISOString(),
                endsAt: new Date("2023-09-01T10:00:00").toISOString(),
                _count: { bookings: 152 },
                createdAt: new Date("2023-07-15").toISOString(),
                updatedAt: new Date("2023-07-15").toISOString(),
                categoryId: "1",
                instructorId: "4",
              },
              {
                id: "2",
                name: "HIIT Workout",
                instructor: { name: "Mike Thompson", id: "5" },
                category: { name: "HIIT", id: "2" },
                startsAt: new Date("2023-09-02T10:00:00").toISOString(),
                endsAt: new Date("2023-09-02T11:00:00").toISOString(),
                _count: { bookings: 138 },
                createdAt: new Date("2023-07-16").toISOString(),
                updatedAt: new Date("2023-07-16").toISOString(),
                categoryId: "2",
                instructorId: "5",
              },
              {
                id: "3",
                name: "Pilates Basics",
                instructor: { name: "Emma Johnson", id: "6" },
                category: { name: "Pilates", id: "3" },
                startsAt: new Date("2023-09-03T14:00:00").toISOString(),
                endsAt: new Date("2023-09-03T15:00:00").toISOString(),
                _count: { bookings: 124 },
                createdAt: new Date("2023-07-17").toISOString(),
                updatedAt: new Date("2023-07-17").toISOString(),
                categoryId: "3",
                instructorId: "6",
              },
            ],
          });
        }, 1000); // Simulate API delay
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to fetch dashboard statistics";
      setError(errorMessage);
      toast(toastUtils.errorToast("Error", errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchDashboardStats();
    toast(
      toastUtils.infoToast("Refreshing", "Dashboard data is being updated")
    );
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "red";
      case "INSTRUCTOR":
        return "purple";
      case "USER":
        return "green";
      default:
        return "gray";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "red";
      case "Medium":
        return "orange";
      case "Low":
        return "yellow";
      default:
        return "gray";
    }
  };

  // Function to format date strings
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Function to calculate revenue from a class based on bookings
  const calculateClassRevenue = (bookingsCount: number) => {
    // Assume $25 per booking
    return bookingsCount * 25;
  };

  return (
    <MotionBox initial="hidden" animate="visible" variants={containerVariants}>
      {/* Welcome Section */}
      <MotionFlex
        variants={itemVariants}
        direction={{ base: "column", md: "row" }}
        mb={8}
        justifyContent="space-between"
        alignItems={{ base: "flex-start", md: "center" }}
      >
        <Box>
          <Heading as="h1" size="xl" mb={2} color={headingColor}>
            Admin Dashboard
          </Heading>
          <Text color={textColor}>
            Welcome back, {user?.name}. Monitor and manage your fitness
            platform.
          </Text>
        </Box>
        <Button
          leftIcon={<FaSync />}
          colorScheme="purple"
          variant="outline"
          onClick={handleRefresh}
          isLoading={isLoading}
          mt={{ base: 4, md: 0 }}
        >
          Refresh
        </Button>
      </MotionFlex>

      {error && <ErrorDisplay error={error} />}

      {/* Stats Grid */}
      <MotionSimpleGrid
        columns={{ base: 1, md: 2, lg: 4 }}
        spacing={6}
        mb={10}
        variants={itemVariants}
      >
        <Stat
          bg={statBg}
          p={5}
          borderRadius="lg"
          boxShadow="sm"
          transition="all 0.3s"
          _hover={{ transform: "translateY(-5px)", boxShadow: "md" }}
        >
          <StatLabel display="flex" alignItems="center">
            <Icon as={FaUsers} mr={2} color="purple.500" />
            Total Users
          </StatLabel>
          {isLoading ? (
            <Skeleton height="36px" width="80%" mt={2} mb={2} />
          ) : (
            <StatNumber fontSize="3xl" fontWeight="bold" color="purple.500">
              {dashboardData.totalUsers}
            </StatNumber>
          )}
          <StatHelpText>Across all user types</StatHelpText>
        </Stat>

        <Stat
          bg={statBg}
          p={5}
          borderRadius="lg"
          boxShadow="sm"
          transition="all 0.3s"
          _hover={{ transform: "translateY(-5px)", boxShadow: "md" }}
        >
          <StatLabel display="flex" alignItems="center">
            <Icon as={FaDumbbell} mr={2} color="purple.500" />
            Active Classes
          </StatLabel>
          {isLoading ? (
            <Skeleton height="36px" width="80%" mt={2} mb={2} />
          ) : (
            <StatNumber fontSize="3xl" fontWeight="bold" color="purple.500">
              {dashboardData.activeClasses}
            </StatNumber>
          )}
          <StatHelpText>Currently scheduled</StatHelpText>
        </Stat>

        <Stat
          bg={statBg}
          p={5}
          borderRadius="lg"
          boxShadow="sm"
          transition="all 0.3s"
          _hover={{ transform: "translateY(-5px)", boxShadow: "md" }}
        >
          <StatLabel display="flex" alignItems="center">
            <Icon as={FaMoneyBillWave} mr={2} color="purple.500" />
            Monthly Revenue
          </StatLabel>
          {isLoading ? (
            <Skeleton height="36px" width="80%" mt={2} mb={2} />
          ) : (
            <StatNumber fontSize="3xl" fontWeight="bold" color="purple.500">
              coming soon
              {/* ${dashboardData.revenue} */}
            </StatNumber>
          )}
          <StatHelpText>For current month</StatHelpText>
        </Stat>

        <Stat
          bg={statBg}
          p={5}
          borderRadius="lg"
          boxShadow="sm"
          transition="all 0.3s"
          _hover={{ transform: "translateY(-5px)", boxShadow: "md" }}
        >
          <StatLabel display="flex" alignItems="center">
            <Icon as={FaChartLine} mr={2} color="purple.500" />
            Growth Rate
          </StatLabel>
          {isLoading ? (
            <Skeleton height="36px" width="80%" mt={2} mb={2} />
          ) : (
            <StatNumber fontSize="3xl" fontWeight="bold" color="purple.500">
              coming soon
              {/* {dashboardData.growthRate}% */}
            </StatNumber>
          )}
          <StatHelpText>Compared to last month</StatHelpText>
        </Stat>
      </MotionSimpleGrid>

      {/* Admin Actions */}
      <MotionBox variants={itemVariants} mb={10}>
        <HStack spacing={4} justifyContent="center" wrap="wrap">
          <Button
            as={RouterLink}
            to="/admin/users"
            colorScheme="purple"
            variant="outline"
            leftIcon={<FaUsers />}
            size="lg"
            m={2}
          >
            Manage Users
          </Button>
          <Button
            as={RouterLink}
            to="/admin/classes"
            colorScheme="purple"
            variant="outline"
            leftIcon={<FaDumbbell />}
            size="lg"
            m={2}
          >
            Manage Classes
          </Button>
          <Button
            as={RouterLink}
            // to="/admin/reports"
            colorScheme="purple"
            variant="outline"
            leftIcon={<FaChartLine />}
            size="lg"
            m={2}
            disabled
          >
            View Reports
          </Button>
          <Button
            as={RouterLink}
            // to="/admin/settings"
            colorScheme="purple"
            variant="outline"
            leftIcon={<FaCog />}
            size="lg"
            m={2}
            disabled
          >
            System Settings
          </Button>
        </HStack>
      </MotionBox>

      {/* Main Content */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        {/* Recent Users Section */}
        <MotionBox variants={itemVariants}>
          <Card
            bg={cardBg}
            borderWidth="1px"
            borderColor={cardBorder}
            borderRadius="lg"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{ boxShadow: "md" }}
            mb={8}
          >
            <CardHeader
              pb={0}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Heading size="md" mb={2} color={headingColor}>
                  Recent Users
                </Heading>
                <Text fontSize="sm" color={textColor}>
                  New registrations and activity
                </Text>
              </Box>
              <Button
                as={RouterLink}
                to="/admin/users"
                variant="outline"
                colorScheme="purple"
                size="sm"
              >
                View All Users
              </Button>
            </CardHeader>
            <CardBody>
              <TableContainer>
                <Table variant="simple" size="sm">
                  <Thead bg={tableHeaderBg}>
                    <Tr>
                      <Th>User</Th>
                      <Th>Role</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {isLoading
                      ? Array(4)
                          .fill(0)
                          .map((_, index) => (
                            <Tr key={`skeleton-user-${index}`}>
                              <Td>
                                <Skeleton height="40px" />
                              </Td>
                              <Td>
                                <Skeleton height="24px" width="80px" />
                              </Td>
                              <Td>
                                <Skeleton height="24px" width="80px" />
                              </Td>
                            </Tr>
                          ))
                      : dashboardData.recentUsers.map((user) => (
                          <Tr
                            key={user.id}
                            _hover={{ bg: tableRowHoverBg }}
                            transition="background-color 0.2s"
                          >
                            <Td>
                              <HStack>
                                <Avatar
                                  size="sm"
                                  name={user.name}
                                  bg="purple.500"
                                />
                                <Box>
                                  <Text fontWeight="medium">{user.name}</Text>
                                  <Text fontSize="xs" color={textColor}>
                                    {user.email}
                                  </Text>
                                </Box>
                              </HStack>
                            </Td>
                            <Td>
                              <Badge
                                colorScheme={getRoleBadgeColor(user.role)}
                                borderRadius="full"
                                px={2}
                              >
                                {user.role}
                              </Badge>
                            </Td>
                            <Td>
                              <Badge
                                colorScheme="green"
                                borderRadius="full"
                                px={2}
                              >
                                Active
                              </Badge>
                            </Td>
                          </Tr>
                        ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
        </MotionBox>

        {/* Popular Classes Section */}
        <MotionBox variants={itemVariants}>
          <Card
            bg={cardBg}
            borderWidth="1px"
            borderColor={cardBorder}
            borderRadius="lg"
            overflow="hidden"
            transition="all 0.3s"
            _hover={{ boxShadow: "md" }}
          >
            <CardHeader
              pb={0}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Heading size="md" mb={2} color={headingColor}>
                  Popular Classes
                </Heading>
                <Text fontSize="sm" color={textColor}>
                  Most attended and highest revenue classes
                </Text>
              </Box>
              <HStack>
                <Select
                  size="sm"
                  width="auto"
                  placeholder="Filter by"
                  borderRadius="md"
                >
                  <option value="all">All Classes</option>
                  <option value="active">Active Only</option>
                  <option value="revenue">By Revenue</option>
                  <option value="attendees">By Attendance</option>
                </Select>
                <Button
                  as={RouterLink}
                  to="/admin/classes"
                  variant="outline"
                  colorScheme="purple"
                  size="sm"
                >
                  Manage All
                </Button>
              </HStack>
            </CardHeader>
            <CardBody>
              <TableContainer>
                <Table variant="simple" size="sm">
                  <Thead bg={tableHeaderBg}>
                    <Tr>
                      <Th>Class</Th>
                      <Th isNumeric>Attendees</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {isLoading
                      ? Array(3)
                          .fill(0)
                          .map((_, index) => (
                            <Tr key={`skeleton-class-${index}`}>
                              <Td>
                                <Skeleton height="40px" />
                              </Td>
                              <Td isNumeric>
                                <Skeleton height="24px" width="60px" />
                              </Td>
                            </Tr>
                          ))
                      : dashboardData.popularClasses.map((classItem) => (
                          <Tr
                            key={classItem.id}
                            _hover={{ bg: tableRowHoverBg }}
                            transition="background-color 0.2s"
                          >
                            <Td>
                              <Box>
                                <Text fontWeight="medium">
                                  {classItem.name}
                                </Text>
                                <Text fontSize="xs" color={textColor}>
                                  by{" "}
                                  {classItem.instructor?.name ||
                                    "Unknown Instructor"}
                                </Text>
                              </Box>
                            </Td>
                            <Td isNumeric fontWeight="medium">
                              {classItem._count?.bookings || 0}
                            </Td>
                          </Tr>
                        ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
        </MotionBox>
      </SimpleGrid>
    </MotionBox>
  );
};

export default AdminDashboard;

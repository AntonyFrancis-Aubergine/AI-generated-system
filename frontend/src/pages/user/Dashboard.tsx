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
  chakra,
  useColorModeValue,
  VStack,
  HStack,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@chakra-ui/react";
import { FaCalendarCheck, FaDumbbell, FaTrophy, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { Link as RouterLink } from "react-router-dom";

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

const UserDashboard = () => {
  const { user } = useAuth();

  // Theme colors
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.800", "white");
  const statBg = useColorModeValue("purple.50", "purple.900");
  const buttonBgGradient = "linear(to-r, purple.600, pink.500)";
  const buttonHoverBgGradient = "linear(to-r, purple.700, pink.600)";

  // Mock data
  const upcomingClasses = 2;
  const completedClasses = 15;
  const fitnessScore = 85;

  // Recent activity data (would typically come from API)
  const recentActivity = [
    { id: 1, type: "Booking", title: "Yoga Class", date: "2023-08-15" },
    { id: 2, type: "Completed", title: "HIIT Workout", date: "2023-08-12" },
    { id: 3, type: "Booking", title: "Pilates", date: "2023-08-10" },
  ];

  // Recommended classes
  const recommendedClasses = [
    {
      id: 1,
      title: "Advanced Yoga",
      instructor: "Jane Smith",
      duration: "60 min",
    },
    {
      id: 2,
      title: "CrossFit Basics",
      instructor: "Mike Johnson",
      duration: "45 min",
    },
  ];

  return (
    <MotionBox initial="hidden" animate="visible" variants={containerVariants}>
      {/* Welcome Section */}
      <MotionFlex variants={itemVariants} direction="column" mb={8}>
        <Heading as="h1" size="xl" mb={2} color={headingColor}>
          Welcome back, {user?.name}
        </Heading>
        <Text color={textColor}>
          Track your fitness journey and manage your workout schedule.
        </Text>
      </MotionFlex>

      {/* Stats Grid */}
      <MotionSimpleGrid
        columns={{ base: 1, md: 3 }}
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
            <Icon as={FaCalendarCheck} mr={2} color="purple.500" />
            Upcoming Classes
          </StatLabel>
          <StatNumber fontSize="3xl" fontWeight="bold" color="purple.500">
            {upcomingClasses}
          </StatNumber>
          <StatHelpText>Classes this week</StatHelpText>
          <Button
            as={RouterLink}
            to="/my-bookings"
            size="sm"
            mt={2}
            variant="outline"
            colorScheme="purple"
          >
            View Bookings
          </Button>
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
            Completed Classes
          </StatLabel>
          <StatNumber fontSize="3xl" fontWeight="bold" color="purple.500">
            {completedClasses}
          </StatNumber>
          <StatHelpText>Total classes completed</StatHelpText>
          <Button
            as={RouterLink}
            to="/profile"
            size="sm"
            mt={2}
            variant="outline"
            colorScheme="purple"
          >
            View History
          </Button>
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
            <Icon as={FaTrophy} mr={2} color="purple.500" />
            Fitness Score
          </StatLabel>
          <StatNumber fontSize="3xl" fontWeight="bold" color="purple.500">
            {fitnessScore}/100
          </StatNumber>
          <StatHelpText>Based on your activity</StatHelpText>
          <Button
            as={RouterLink}
            to="/profile"
            size="sm"
            mt={2}
            variant="outline"
            colorScheme="purple"
          >
            Improve Score
          </Button>
        </Stat>
      </MotionSimpleGrid>

      {/* Main Content */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
        {/* Recommended Classes */}
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
            <CardHeader pb={0}>
              <Heading size="md" mb={2} color={headingColor}>
                Recommended Classes
              </Heading>
              <Text fontSize="sm" color={textColor}>
                Based on your previous activities
              </Text>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {recommendedClasses.map((classItem) => (
                  <Box
                    key={classItem.id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor={cardBorder}
                    _hover={{
                      bg: useColorModeValue("gray.50", "gray.700"),
                      transform: "translateY(-2px)",
                      transition: "all 0.2s",
                    }}
                  >
                    <HStack justify="space-between">
                      <VStack align="start" spacing={1}>
                        <Heading size="sm">{classItem.title}</Heading>
                        <Text fontSize="sm" color={textColor}>
                          {classItem.instructor} • {classItem.duration}
                        </Text>
                      </VStack>
                      <Icon
                        as={FaHeart}
                        color="pink.400"
                        boxSize={5}
                        opacity={0.8}
                      />
                    </HStack>
                  </Box>
                ))}

                <Button
                  as={RouterLink}
                  to="/classes"
                  alignSelf="flex-start"
                  bgGradient={buttonBgGradient}
                  color="white"
                  _hover={{
                    bgGradient: buttonHoverBgGradient,
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  size="md"
                  mt={2}
                >
                  Browse All Classes
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </MotionBox>

        {/* Recent Activity */}
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
            <CardHeader pb={0}>
              <Heading size="md" mb={2} color={headingColor}>
                Recent Activity
              </Heading>
              <Text fontSize="sm" color={textColor}>
                Your latest actions and bookings
              </Text>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {recentActivity.map((activity) => (
                  <HStack
                    key={activity.id}
                    justify="space-between"
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor={cardBorder}
                  >
                    <VStack align="start" spacing={0}>
                      <HStack>
                        <Icon
                          as={
                            activity.type === "Booking"
                              ? FaCalendarCheck
                              : FaDumbbell
                          }
                          color={
                            activity.type === "Booking"
                              ? "green.500"
                              : "blue.500"
                          }
                        />
                        <Text fontWeight="medium">{activity.title}</Text>
                      </HStack>
                      <Text fontSize="sm" color={textColor}>
                        {activity.type} on{" "}
                        {new Date(activity.date).toLocaleDateString()}
                      </Text>
                    </VStack>
                    <chakra.span
                      px={2}
                      py={1}
                      bg={
                        activity.type === "Booking" ? "green.100" : "blue.100"
                      }
                      color={
                        activity.type === "Booking" ? "green.700" : "blue.700"
                      }
                      fontSize="xs"
                      fontWeight="bold"
                      rounded="md"
                      textTransform="uppercase"
                    >
                      {activity.type}
                    </chakra.span>
                  </HStack>
                ))}

                <Divider borderColor={cardBorder} />

                <Button
                  as={RouterLink}
                  to="/profile"
                  variant="outline"
                  colorScheme="purple"
                  alignSelf="flex-start"
                >
                  View All Activity
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </MotionBox>
      </SimpleGrid>
    </MotionBox>
  );
};

export default UserDashboard;

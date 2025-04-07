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
  Badge,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Divider,
  Avatar,
} from "@chakra-ui/react";
import {
  FaUsers,
  FaDumbbell,
  FaStar,
  FaCalendarAlt,
  FaChartLine,
  FaClock,
} from "react-icons/fa";
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

const InstructorDashboard = () => {
  const { user } = useAuth();

  // Theme colors
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.800", "white");
  const statBg = useColorModeValue("purple.50", "purple.900");
  const tableBg = useColorModeValue("white", "gray.800");
  const tableHeaderBg = useColorModeValue("gray.50", "gray.700");
  const tableRowHoverBg = useColorModeValue("gray.50", "gray.700");
  const buttonBgGradient = "linear(to-r, purple.600, pink.500)";
  const buttonHoverBgGradient = "linear(to-r, purple.700, pink.600)";

  // Mock data
  const totalStudents = 78;
  const activeClasses = 5;
  const averageRating = 4.8;
  const bookingRate = 94;

  // Upcoming classes data (would come from API)
  const upcomingClasses = [
    {
      id: 1,
      title: "Power Yoga",
      time: "Today, 9:00 AM",
      duration: "60 min",
      enrolled: 12,
      capacity: 15,
    },
    {
      id: 2,
      title: "HIIT Workout",
      time: "Tomorrow, 10:00 AM",
      duration: "45 min",
      enrolled: 18,
      capacity: 20,
    },
    {
      id: 3,
      title: "Pilates Foundations",
      time: "Aug 18, 2:00 PM",
      duration: "60 min",
      enrolled: 8,
      capacity: 15,
    },
  ];

  // Student data
  const topStudents = [
    { id: 1, name: "Sarah Johnson", classes: 24, lastClass: "2 days ago" },
    { id: 2, name: "Michael Brown", classes: 18, lastClass: "1 week ago" },
    { id: 3, name: "Emily Davis", classes: 15, lastClass: "4 days ago" },
  ];

  // Feedback data
  const recentFeedback = [
    {
      id: 1,
      student: "Lisa M.",
      class: "Power Yoga",
      rating: 5,
      comment: "Amazing class! The instructor was very attentive and helpful.",
      date: "Aug 15, 2023",
    },
    {
      id: 2,
      student: "John D.",
      class: "HIIT Workout",
      rating: 4,
      comment: "Great workout, challenging but fun.",
      date: "Aug 12, 2023",
    },
  ];

  return (
    <MotionBox initial="hidden" animate="visible" variants={containerVariants}>
      {/* Welcome Section */}
      <MotionFlex variants={itemVariants} direction="column" mb={8}>
        <Heading as="h1" size="xl" mb={2} color={headingColor}>
          Instructor Dashboard
        </Heading>
        <Text color={textColor}>
          Welcome back, {user?.name}. Manage your classes and track your
          performance.
        </Text>
      </MotionFlex>

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
            Total Students
          </StatLabel>
          <StatNumber fontSize="3xl" fontWeight="bold" color="purple.500">
            {totalStudents}
          </StatNumber>
          <StatHelpText>Across all classes</StatHelpText>
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
          <StatNumber fontSize="3xl" fontWeight="bold" color="purple.500">
            {activeClasses}
          </StatNumber>
          <StatHelpText>Currently teaching</StatHelpText>
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
            <Icon as={FaStar} mr={2} color="purple.500" />
            Average Rating
          </StatLabel>
          <StatNumber fontSize="3xl" fontWeight="bold" color="purple.500">
            {averageRating}/5
          </StatNumber>
          <StatHelpText>From student feedback</StatHelpText>
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
            Booking Rate
          </StatLabel>
          <StatNumber fontSize="3xl" fontWeight="bold" color="purple.500">
            {bookingRate}%
          </StatNumber>
          <StatHelpText>Class capacity filled</StatHelpText>
        </Stat>
      </MotionSimpleGrid>

      {/* Main Content */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} mb={8}>
        {/* Upcoming Classes */}
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
                  Upcoming Classes
                </Heading>
                <Text fontSize="sm" color={textColor}>
                  Your schedule for the next few days
                </Text>
              </Box>
              <Button
                as={RouterLink}
                to="/instructor/classes"
                variant="outline"
                colorScheme="purple"
                leftIcon={<FaCalendarAlt />}
                size="sm"
              >
                All Classes
              </Button>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {upcomingClasses.map((classItem) => (
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
                    <HStack justify="space-between" mb={3}>
                      <Heading size="sm">{classItem.title}</Heading>
                      <HStack>
                        <Icon as={FaClock} color="purple.500" />
                        <Text fontSize="sm" fontWeight="medium">
                          {classItem.duration}
                        </Text>
                      </HStack>
                    </HStack>

                    <Text fontSize="sm" color={textColor} mb={3}>
                      {classItem.time}
                    </Text>

                    <Box>
                      <HStack justify="space-between" mb={1}>
                        <Text fontSize="xs" fontWeight="medium">
                          {classItem.enrolled}/{classItem.capacity} students
                        </Text>
                        <Text fontSize="xs" fontWeight="medium">
                          {Math.round(
                            (classItem.enrolled / classItem.capacity) * 100
                          )}
                          %
                        </Text>
                      </HStack>
                      <Progress
                        value={(classItem.enrolled / classItem.capacity) * 100}
                        size="sm"
                        colorScheme="purple"
                        borderRadius="full"
                      />
                    </Box>
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>

          {/* Top Students Section */}
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
                Top Students
              </Heading>
              <Text fontSize="sm" color={textColor}>
                Your most engaged class attendees
              </Text>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {topStudents.map((student) => (
                  <HStack
                    key={student.id}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor={cardBorder}
                    _hover={{
                      bg: useColorModeValue("gray.50", "gray.700"),
                      transform: "translateY(-2px)",
                      transition: "all 0.2s",
                    }}
                  >
                    <Avatar size="sm" name={student.name} bg="purple.500" />
                    <Box flex="1">
                      <Text fontWeight="medium">{student.name}</Text>
                      <Text fontSize="sm" color={textColor}>
                        Last class: {student.lastClass}
                      </Text>
                    </Box>
                    <Badge
                      colorScheme="purple"
                      borderRadius="full"
                      px={3}
                      py={1}
                    >
                      {student.classes} classes
                    </Badge>
                  </HStack>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </MotionBox>

        {/* Recent Feedback */}
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
                Recent Feedback
              </Heading>
              <Text fontSize="sm" color={textColor}>
                What your students are saying
              </Text>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {recentFeedback.map((feedback) => (
                  <Box
                    key={feedback.id}
                    p={4}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor={cardBorder}
                    _hover={{
                      bg: useColorModeValue("gray.50", "gray.700"),
                      transition: "all 0.2s",
                    }}
                  >
                    <HStack justify="space-between" mb={2}>
                      <HStack>
                        <Text fontWeight="medium">{feedback.student}</Text>
                        <Text fontSize="sm" color={textColor}>
                          on {feedback.class}
                        </Text>
                      </HStack>
                      <HStack>
                        {[...Array(5)].map((_, i) => (
                          <Icon
                            key={i}
                            as={FaStar}
                            color={
                              i < feedback.rating ? "yellow.400" : "gray.300"
                            }
                            boxSize={3}
                          />
                        ))}
                      </HStack>
                    </HStack>

                    <Text fontSize="sm" mb={2}>
                      "{feedback.comment}"
                    </Text>

                    <Text fontSize="xs" color={textColor} textAlign="right">
                      {feedback.date}
                    </Text>
                  </Box>
                ))}

                <Button
                  as={RouterLink}
                  to="/instructor/feedback"
                  colorScheme="purple"
                  variant="outline"
                  alignSelf="flex-start"
                  mt={2}
                >
                  View All Feedback
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </MotionBox>
      </SimpleGrid>

      {/* Create Class Button */}
      <MotionBox
        variants={itemVariants}
        display="flex"
        justifyContent="center"
        my={6}
      >
        <Button
          as={RouterLink}
          to="/admin/classes"
          size="lg"
          bgGradient={buttonBgGradient}
          color="white"
          _hover={{
            bgGradient: buttonHoverBgGradient,
            transform: "translateY(-2px)",
            boxShadow: "lg",
          }}
          px={8}
          leftIcon={<FaDumbbell />}
        >
          Create New Class
        </Button>
      </MotionBox>
    </MotionBox>
  );
};

export default InstructorDashboard;

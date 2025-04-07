import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  Stack,
  Badge,
  IconButton,
  HStack,
  VStack,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  SimpleGrid,
  Divider,
  Icon,
  useColorModeValue,
  Tag,
  TagLabel,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarIcon,
  TimeIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import {
  FaChalkboardTeacher,
  FaHistory,
  FaRegCalendarAlt,
  FaSync,
} from "react-icons/fa";
import { format } from "date-fns";
import { bookingService } from "../../services/api";
import { Booking } from "../../types";
import Loading from "../../components/Loading";
import ErrorDisplay from "../../components/ErrorDisplay";
import { motion } from "framer-motion";

// Create motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionCard = motion(Card);

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
  hover: {
    y: -5,
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: { duration: 0.2 },
  },
};

const BookingList = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Theme colors
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.800", "white");
  const cardHeaderBg = useColorModeValue("purple.50", "purple.900");
  const accentColor = "purple";

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await bookingService.getBookings(page, 8);

      if (response.success) {
        setBookings(response.data.data);
        setTotalPages(response.data.meta.totalPages);
      } else {
        setError(response.message);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch bookings";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page]);

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy h:mm a");
  };

  const handleChangePage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      // Scroll to top when changing pages
      window.scrollTo(0, 0);
    }
  };

  // Determine if a class is in the past
  const isClassPast = (endsAt: string) => {
    return new Date(endsAt) < new Date();
  };

  const handleViewDetails = (classId: string) => {
    navigate(`/classes/${classId}`);
  };

  const handleRefresh = () => {
    fetchBookings();
  };

  const getCategoryColor = (categoryName: string = "") => {
    // Map categories to colors for visual distinction
    const categoryColors: Record<string, string> = {
      Yoga: "green",
      Cardio: "red",
      "Strength Training": "orange",
      Pilates: "blue",
      HIIT: "pink",
      Zumba: "purple",
    };

    return categoryColors[categoryName] || "gray";
  };

  const renderBookingCards = () => {
    if (isLoading) {
      return <Loading text="Loading your bookings..." />;
    }

    if (bookings.length === 0) {
      return (
        <MotionCard
          variants={itemVariants}
          bg={cardBg}
          borderWidth="1px"
          borderColor={cardBorder}
          borderRadius="lg"
          p={6}
          boxShadow="sm"
          textAlign="center"
          gridColumn="1 / -1"
        >
          <VStack spacing={6}>
            <Icon
              as={FaRegCalendarAlt}
              boxSize="50px"
              color={`${accentColor}.400`}
            />
            <Heading as="h3" size="md">
              No Bookings Found
            </Heading>
            <Text color={textColor} maxW="lg">
              You haven't booked any fitness classes yet. Browse our available
              classes and book your next workout!
            </Text>
            <Button
              colorScheme={accentColor}
              size="lg"
              onClick={() => navigate("/classes")}
              boxShadow="md"
              _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
              transition="all 0.2s"
            >
              Browse Classes
            </Button>
          </VStack>
        </MotionCard>
      );
    }

    return bookings.map((booking) => (
      <MotionCard
        key={booking.id}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        boxShadow="md"
        borderRadius="lg"
        overflow="hidden"
        borderWidth="1px"
        borderColor={cardBorder}
      >
        <CardHeader bg={cardHeaderBg} pb={3}>
          <Flex justifyContent="space-between" alignItems="flex-start">
            <VStack align="flex-start" spacing={1}>
              <Heading size="md" color={headingColor}>
                {booking.fitnessClass?.name}
              </Heading>
              {booking.fitnessClass?.category && (
                <Tag
                  size="md"
                  colorScheme={getCategoryColor(
                    booking.fitnessClass.category.name
                  )}
                  borderRadius="full"
                >
                  <TagLabel>{booking.fitnessClass.category.name}</TagLabel>
                </Tag>
              )}
            </VStack>
            <Badge
              colorScheme={
                booking.fitnessClass && isClassPast(booking.fitnessClass.endsAt)
                  ? "gray"
                  : "green"
              }
              fontSize="0.8em"
              px={2}
              py={1}
              borderRadius="full"
            >
              {booking.fitnessClass && isClassPast(booking.fitnessClass.endsAt)
                ? "Completed"
                : "Upcoming"}
            </Badge>
          </Flex>
        </CardHeader>

        <CardBody pt={4}>
          <VStack spacing={3} align="stretch">
            <HStack>
              <Icon
                as={FaChalkboardTeacher}
                color={`${accentColor}.500`}
                boxSize={4}
              />
              <Text fontWeight="medium">
                {booking.fitnessClass?.instructor?.name || "Not specified"}
              </Text>
            </HStack>

            <HStack>
              <Icon
                as={CalendarIcon}
                color={`${accentColor}.500`}
                boxSize={4}
              />
              <Text fontSize="sm">
                {booking.fitnessClass &&
                  formatDateTime(booking.fitnessClass.startsAt)}
              </Text>
            </HStack>

            <HStack>
              <Icon as={TimeIcon} color={`${accentColor}.500`} boxSize={4} />
              <Text fontSize="sm">
                {booking.fitnessClass &&
                  `to ${formatDateTime(booking.fitnessClass.endsAt)}`}
              </Text>
            </HStack>
          </VStack>
        </CardBody>

        <Divider />

        <CardFooter>
          <Button
            variant="solid"
            colorScheme={accentColor}
            leftIcon={<ViewIcon />}
            w="100%"
            onClick={() =>
              booking.fitnessClass && handleViewDetails(booking.fitnessClass.id)
            }
            boxShadow="sm"
            _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
            transition="all 0.2s"
          >
            View Details
          </Button>
        </CardFooter>
      </MotionCard>
    ));
  };

  return (
    <MotionBox
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      p={4}
    >
      {/* Header Section */}
      <MotionFlex
        variants={itemVariants}
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align={{ base: "flex-start", md: "center" }}
        mb={8}
      >
        <Box mb={{ base: 4, md: 0 }}>
          <Heading as="h1" size="xl" mb={2} color={headingColor}>
            My Bookings
          </Heading>
          <Text color={textColor}>
            View and manage all your booked fitness classes
          </Text>
        </Box>
        <HStack>
          <Tooltip label="Refresh bookings">
            <IconButton
              aria-label="Refresh bookings"
              icon={<FaSync />}
              colorScheme={accentColor}
              variant="outline"
              onClick={handleRefresh}
              isLoading={isLoading}
            />
          </Tooltip>
          <Button
            leftIcon={<FaRegCalendarAlt />}
            colorScheme={accentColor}
            onClick={() => navigate("/classes")}
          >
            Browse Classes
          </Button>
        </HStack>
      </MotionFlex>

      {error && <ErrorDisplay error={error} mb={6} />}

      {/* Main Content - Booking Cards */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} spacing={6} mb={8}>
        {renderBookingCards()}
      </SimpleGrid>

      {/* Pagination */}
      {totalPages > 1 && (
        <MotionFlex variants={itemVariants} justify="center" mt={4}>
          <HStack spacing={2}>
            <Button
              leftIcon={<ChevronLeftIcon />}
              onClick={() => handleChangePage(page - 1)}
              isDisabled={page === 1}
              variant="outline"
              colorScheme={accentColor}
              size="sm"
            >
              Previous
            </Button>
            <Text fontWeight="medium" mx={2}>
              Page {page} of {totalPages}
            </Text>
            <Button
              rightIcon={<ChevronRightIcon />}
              onClick={() => handleChangePage(page + 1)}
              isDisabled={page === totalPages}
              variant="outline"
              colorScheme={accentColor}
              size="sm"
            >
              Next
            </Button>
          </HStack>
        </MotionFlex>
      )}
    </MotionBox>
  );
};

export default BookingList;

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  Button,
  Flex,
  Badge,
  Divider,
  Card,
  CardBody,
  Spinner,
  useToast,
  Grid,
  GridItem,
  Icon,
  HStack,
  VStack,
  useColorModeValue,
  Tag,
  TagLabel,
  Tooltip,
  CardHeader,
  CardFooter,
  IconButton,
} from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  CalendarIcon,
  TimeIcon,
  InfoIcon,
} from "@chakra-ui/icons";
import {
  FaMapMarkerAlt,
  FaChalkboardTeacher,
  FaRegCalendarAlt,
  FaCalendarCheck,
  FaArrowLeft,
} from "react-icons/fa";
import { format } from "date-fns";
import { fitnessClassService } from "../../services/api";
import { FitnessClass } from "../../types";
import Loading from "../../components/Loading";
import ErrorDisplay from "../../components/ErrorDisplay";
import * as toastUtils from "../../utils/toast";
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

const ClassDetails = () => {
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [fitnessClass, setFitnessClass] = useState<FitnessClass | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Theme colors
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const headingColor = useColorModeValue("gray.800", "white");
  const cardHeaderBg = useColorModeValue("purple.50", "purple.900");
  const accentColor = "purple";

  useEffect(() => {
    const fetchClassDetails = async () => {
      if (!classId) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await fitnessClassService.getClassById(classId);

        if (response.success) {
          setFitnessClass(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch class details";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClassDetails();
  }, [classId]);

  const handleBookClass = async () => {
    if (!classId || !fitnessClass) return;

    try {
      setIsBooking(true);
      const response = await fitnessClassService.bookClass(classId);

      if (response.success) {
        toast(toastUtils.bookingSuccessToast(fitnessClass.name));
      } else {
        toast(toastUtils.bookingErrorToast(response.message));
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to book class";
      toast(toastUtils.errorToast("Booking Failed", errorMessage));
    } finally {
      setIsBooking(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy h:mm a");
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "EEEE, MMMM dd, yyyy");
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a");
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

  if (isLoading) {
    return <Loading text="Loading class details..." />;
  }

  if (error || !fitnessClass) {
    return (
      <Container maxW="container.md" py={10}>
        <ErrorDisplay
          error={error || "Class not found"}
          title="Error Loading Class"
          mb={6}
        />
        <Button
          leftIcon={<FaArrowLeft />}
          colorScheme={accentColor}
          onClick={() => navigate("/classes")}
        >
          Back to Classes
        </Button>
      </Container>
    );
  }

  // Check if the class has already started or ended
  const now = new Date();
  const classStartsAt = new Date(fitnessClass.startsAt);
  const classEndsAt = new Date(fitnessClass.endsAt);
  const isClassStarted = classStartsAt <= now;
  const isClassEnded = classEndsAt <= now;

  return (
    <MotionBox
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      p={4}
      maxW="container.lg"
      mx="auto"
    >
      {/* Navigation */}
      <MotionFlex variants={itemVariants} align="center" mb={6}>
        <Button
          leftIcon={<FaArrowLeft />}
          variant="ghost"
          onClick={() => navigate("/classes")}
          _hover={{ bg: `${accentColor}.50` }}
        >
          Back to Classes
        </Button>
      </MotionFlex>

      {/* Main Card */}
      <MotionCard
        variants={itemVariants}
        borderRadius="xl"
        overflow="hidden"
        boxShadow="xl"
        borderWidth="1px"
        borderColor={cardBorder}
      >
        {/* Header */}
        <CardHeader bg={cardHeaderBg} py={6}>
          <Flex
            justifyContent="space-between"
            alignItems="flex-start"
            wrap="wrap"
            gap={4}
          >
            <Box>
              <HStack spacing={2} mb={2}>
                {fitnessClass.category && (
                  <Tag
                    size="md"
                    colorScheme={getCategoryColor(fitnessClass.category.name)}
                    borderRadius="full"
                  >
                    <TagLabel>{fitnessClass.category.name}</TagLabel>
                  </Tag>
                )}
                <Badge
                  colorScheme={
                    isClassEnded ? "gray" : isClassStarted ? "orange" : "green"
                  }
                  fontSize="0.8em"
                  px={2}
                  py={1}
                  borderRadius="full"
                >
                  {isClassEnded
                    ? "Completed"
                    : isClassStarted
                    ? "In Progress"
                    : "Upcoming"}
                </Badge>
              </HStack>
              <Heading as="h1" size="xl" mb={2} color={headingColor}>
                {fitnessClass.name}
              </Heading>
              <Text color={textColor}>
                Join this {fitnessClass.category?.name || "fitness"} class with{" "}
                {fitnessClass.instructor?.name || "our instructor"}
              </Text>
            </Box>
          </Flex>
        </CardHeader>

        <Divider />

        <CardBody>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={8}>
            {/* Class Details */}
            <GridItem>
              <VStack align="stretch" spacing={5}>
                <Heading as="h3" size="md" mb={2} color={headingColor}>
                  Class Details
                </Heading>

                <HStack spacing={4} align="flex-start">
                  <Icon
                    as={FaChalkboardTeacher}
                    color={`${accentColor}.500`}
                    boxSize={5}
                    mt={1}
                  />
                  <Box>
                    <Text fontWeight="bold">Instructor</Text>
                    <Text color={textColor}>
                      {fitnessClass.instructor?.name || "Not specified"}
                    </Text>
                  </Box>
                </HStack>

                <HStack spacing={4} align="flex-start">
                  <Icon
                    as={FaRegCalendarAlt}
                    color={`${accentColor}.500`}
                    boxSize={5}
                    mt={1}
                  />
                  <Box>
                    <Text fontWeight="bold">Date</Text>
                    <Text color={textColor}>
                      {formatDate(fitnessClass.startsAt)}
                    </Text>
                  </Box>
                </HStack>

                <HStack spacing={4} align="flex-start">
                  <Icon
                    as={TimeIcon}
                    color={`${accentColor}.500`}
                    boxSize={5}
                    mt={1}
                  />
                  <Box>
                    <Text fontWeight="bold">Time</Text>
                    <Text color={textColor}>
                      {formatTime(fitnessClass.startsAt)} -{" "}
                      {formatTime(fitnessClass.endsAt)}
                    </Text>
                    <Text fontSize="sm" color={textColor} opacity={0.8}>
                      Duration:{" "}
                      {Math.round(
                        (classEndsAt.getTime() - classStartsAt.getTime()) /
                          (1000 * 60)
                      )}{" "}
                      minutes
                    </Text>
                  </Box>
                </HStack>
              </VStack>
            </GridItem>

            {/* Booking Section */}
            <GridItem>
              <Card
                variant="outline"
                borderRadius="lg"
                borderColor={cardBorder}
                bg={useColorModeValue("gray.50", "gray.700")}
                h="100%"
              >
                <CardBody>
                  <VStack spacing={6} align="stretch">
                    <Heading as="h3" size="md" color={headingColor}>
                      Book This Class
                    </Heading>

                    <Text color={textColor}>
                      Ready to join this class? Click below to secure your spot.
                    </Text>

                    <Box
                      bg={useColorModeValue(
                        `${accentColor}.50`,
                        `${accentColor}.900`
                      )}
                      p={4}
                      borderRadius="md"
                    >
                      <HStack>
                        <Icon as={InfoIcon} color={`${accentColor}.500`} />
                        <Text fontWeight="medium" fontSize="sm">
                          {isClassEnded
                            ? "This class has already ended"
                            : isClassStarted
                            ? "This class has already started"
                            : "Classes can be booked up until 1 hour before start time"}
                        </Text>
                      </HStack>
                    </Box>

                    <Button
                      colorScheme={accentColor}
                      size="lg"
                      width="100%"
                      onClick={handleBookClass}
                      isLoading={isBooking}
                      loadingText="Booking..."
                      isDisabled={isClassStarted}
                      leftIcon={<FaCalendarCheck />}
                      boxShadow="md"
                      _hover={
                        !isClassStarted
                          ? { transform: "translateY(-2px)", boxShadow: "lg" }
                          : undefined
                      }
                      transition="all 0.2s"
                    >
                      {isClassEnded
                        ? "Class Ended"
                        : isClassStarted
                        ? "Class In Progress"
                        : "Book Now"}
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </CardBody>

        <Divider />

        <CardFooter>
          <HStack spacing={4} width="100%" justify="space-between">
            <Button
              variant="outline"
              colorScheme={accentColor}
              leftIcon={<FaArrowLeft />}
              onClick={() => navigate("/classes")}
            >
              Back to Classes
            </Button>

            <Button
              variant="outline"
              colorScheme={accentColor}
              onClick={() => navigate("/my-bookings")}
            >
              View My Bookings
            </Button>
          </HStack>
        </CardFooter>
      </MotionCard>
    </MotionBox>
  );
};

export default ClassDetails;

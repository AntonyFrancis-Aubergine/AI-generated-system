import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
  Input,
  Select,
  Stack,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Badge,
  Divider,
  useToast,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftElement,
  Skeleton,
  SkeletonText,
  HStack,
  IconButton,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import { format } from "date-fns";
import {
  fitnessClassService,
  categoryService,
  userService,
} from "../../services/api";
import { FitnessClass, FitnessClassFilters, Category, User } from "../../types";
import { useNavigate } from "react-router-dom";
import Loading, { InlineLoading } from "../../components/Loading";
import ErrorDisplay from "../../components/ErrorDisplay";
import * as toastUtils from "../../utils/toast";

const ClassList = () => {
  const [classes, setClasses] = useState<FitnessClass[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [instructors, setInstructors] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isInstructorsLoading, setIsInstructorsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FitnessClassFilters>({
    page: 1,
    limit: 10,
    name: "",
  });
  const [totalPages, setTotalPages] = useState(1);
  const [bookingInProgress, setBookingInProgress] = useState<string | null>(
    null
  );
  const toast = useToast();
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      setIsCategoriesLoading(true);
      const response = await categoryService.getCategories();
      if (response.success) {
        setCategories(response.data.data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch categories";
      console.error(errorMessage);
      // Don't set global error for categories - just show empty state
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      setIsInstructorsLoading(true);
      const response = await userService.getInstructors();
      if (response.success) {
        setInstructors(response.data);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch instructors";
      console.error(errorMessage);
      // Don't set global error for instructors - just show empty state
    } finally {
      setIsInstructorsLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fitnessClassService.getClasses(filters);

      if (response.success) {
        setClasses(response.data.data);
        setTotalPages(response.data.meta.totalPages);
      } else {
        setError(response.message);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch classes";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchInstructors();
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset to first page when searching
    setFilters((prev) => ({ ...prev, page: 1 }));
  };

  const handleBookClass = async (classId: string, className: string) => {
    try {
      setBookingInProgress(classId);
      const response = await fitnessClassService.bookClass(classId);

      if (response.success) {
        toast(toastUtils.bookingSuccessToast(className));
        // Refresh the class list
        fetchClasses();
      } else {
        toast(toastUtils.bookingErrorToast(response.message));
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to book class";
      toast(toastUtils.errorToast("Booking Failed", errorMessage));
    } finally {
      setBookingInProgress(null);
    }
  };

  const handleViewDetails = (classId: string) => {
    navigate(`/classes/${classId}`);
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy h:mm a");
  };

  const handleChangePage = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
      // Scroll to top when changing pages
      window.scrollTo(0, 0);
    }
  };

  const handleClearError = () => {
    setError(null);
  };

  const renderClassCards = () => {
    if (isLoading) {
      // Show skeleton loaders while loading
      return Array(3)
        .fill(0)
        .map((_, index) => (
          <Card
            key={`skeleton-${index}`}
            boxShadow="md"
            borderRadius="lg"
            overflow="hidden"
          >
            <CardHeader bg="gray.50" pb={2}>
              <Skeleton height="20px" width="70%" mb={2} />
              <Skeleton height="16px" width="40%" />
            </CardHeader>
            <CardBody pt={3}>
              <Stack spacing={2}>
                <SkeletonText noOfLines={3} spacing={2} />
              </Stack>
            </CardBody>
            <CardFooter>
              <Stack spacing={2} width="100%">
                <Skeleton height="40px" />
                <Skeleton height="40px" />
              </Stack>
            </CardFooter>
          </Card>
        ));
    }

    if (!isLoading && classes.length === 0) {
      return (
        <Box
          textAlign="center"
          p={8}
          borderRadius="lg"
          border="1px dashed"
          borderColor="gray.200"
          gridColumn="1 / -1"
        >
          <Text fontSize="lg" mb={4}>
            No classes found matching your criteria
          </Text>
          <Button
            colorScheme="teal"
            variant="outline"
            onClick={() => setFilters({ page: 1, limit: 10 })}
          >
            Clear Filters
          </Button>
        </Box>
      );
    }

    return classes.map((fitnessClass) => (
      <Card
        key={fitnessClass.id}
        boxShadow="md"
        borderRadius="lg"
        overflow="hidden"
        transition="transform 0.2s, box-shadow 0.2s"
        _hover={{ transform: "translateY(-5px)", boxShadow: "lg" }}
      >
        <CardHeader bg="teal.50" pb={2}>
          <Heading size="md">{fitnessClass.name}</Heading>
          {fitnessClass.category && (
            <Badge colorScheme="teal" mt={1}>
              {fitnessClass.category.name}
            </Badge>
          )}
        </CardHeader>

        <CardBody pt={3}>
          <Stack spacing={2}>
            <Text>
              <strong>Instructor:</strong>{" "}
              {fitnessClass.instructor?.name || "Not specified"}
            </Text>
            <Text>
              <strong>Starts at:</strong>{" "}
              {formatDateTime(fitnessClass.startsAt)}
            </Text>
            <Text>
              <strong>Ends at:</strong> {formatDateTime(fitnessClass.endsAt)}
            </Text>
          </Stack>
        </CardBody>

        <Divider />

        <CardFooter>
          <Stack spacing={2} width="100%">
            <Button
              colorScheme="teal"
              onClick={() =>
                handleBookClass(fitnessClass.id, fitnessClass.name)
              }
              isLoading={bookingInProgress === fitnessClass.id}
              loadingText="Booking..."
            >
              Book Now
            </Button>
            <Button
              variant="outline"
              colorScheme="teal"
              onClick={() => handleViewDetails(fitnessClass.id)}
            >
              View Details
            </Button>
          </Stack>
        </CardFooter>
      </Card>
    ));
  };

  return (
    <Container maxW="container.xl" py={6}>
      <Stack spacing={8}>
        <Box>
          <Heading as="h1" size="xl" mb={2}>
            Available Fitness Classes
          </Heading>
          <Text color="gray.600">
            Browse and book available fitness classes
          </Text>
        </Box>

        <ErrorDisplay error={error} onClear={handleClearError} />

        <Box as="form" onSubmit={handleSearch}>
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
            <FormControl>
              <FormLabel>Search</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search by class name"
                  value={filters.name || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select
                placeholder="All Categories"
                value={filters.categoryId || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    categoryId: e.target.value || undefined,
                    page: 1, // Reset to first page when filtering
                  }))
                }
                isDisabled={isCategoriesLoading}
              >
                {isCategoriesLoading ? (
                  <option disabled>Loading categories...</option>
                ) : (
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))
                )}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>Instructor</FormLabel>
              <Select
                placeholder="All Instructors"
                value={filters.instructorId || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    instructorId: e.target.value || undefined,
                    page: 1, // Reset to first page when filtering
                  }))
                }
                isDisabled={isInstructorsLoading}
              >
                {isInstructorsLoading ? (
                  <option disabled>Loading instructors...</option>
                ) : (
                  instructors.map((instructor) => (
                    <option key={instructor.id} value={instructor.id}>
                      {instructor.name}
                    </option>
                  ))
                )}
              </Select>
            </FormControl>

            <FormControl alignSelf="flex-end">
              <Button
                colorScheme="teal"
                type="submit"
                isLoading={isLoading}
                loadingText="Filtering..."
                width="100%"
              >
                Apply Filters
              </Button>
            </FormControl>
          </SimpleGrid>
        </Box>

        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={6}
        >
          {renderClassCards()}
        </Grid>

        {totalPages > 1 && (
          <Flex justify="center" mt={8}>
            <HStack>
              <IconButton
                aria-label="Previous page"
                icon={<ChevronLeftIcon />}
                onClick={() => handleChangePage(filters.page - 1)}
                isDisabled={filters.page <= 1 || isLoading}
              />

              <Text>
                Page {filters.page} of {totalPages}
              </Text>

              <IconButton
                aria-label="Next page"
                icon={<ChevronRightIcon />}
                onClick={() => handleChangePage(filters.page + 1)}
                isDisabled={filters.page >= totalPages || isLoading}
              />
            </HStack>
          </Flex>
        )}
      </Stack>
    </Container>
  );
};

export default ClassList;

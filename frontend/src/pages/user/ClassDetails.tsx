import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
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
  useColorModeValue,
  Tag,
  VStack,
} from '@chakra-ui/react'
import { ChevronLeftIcon, InfoIcon } from '@chakra-ui/icons'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import { fitnessClassService } from '../../services/api'
import { FitnessClass } from '../../types'
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaMapMarkerAlt,
  FaDumbbell,
} from 'react-icons/fa'

// Create motion components
const MotionBox = motion(Box)
const MotionCard = motion(Card)
const MotionContainer = motion(Container)

const ClassDetails = () => {
  const { classId } = useParams<{ classId: string }>()
  const navigate = useNavigate()
  const toast = useToast()
  const [fitnessClass, setFitnessClass] = useState<FitnessClass | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800')
  const headerBg = useColorModeValue('brand.50', 'brand.900')
  const errorBg = useColorModeValue('red.50', 'rgba(200, 50, 50, 0.2)')
  const textColor = useColorModeValue('neutral.800', 'white')
  const secondaryTextColor = useColorModeValue('neutral.600', 'neutral.300')
  const borderColor = useColorModeValue('neutral.100', 'gray.700')

  useEffect(() => {
    const fetchClassDetails = async () => {
      if (!classId) return

      try {
        setIsLoading(true)
        setError(null)
        const response = await fitnessClassService.getClassById(classId)

        if (response.success) {
          setFitnessClass(response.data)
        } else {
          setError(response.message)
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch class details'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchClassDetails()
  }, [classId])

  const handleBookClass = async () => {
    if (!classId) return

    try {
      setIsBooking(true)
      const response = await fitnessClassService.bookClass(classId)

      if (response.success) {
        toast({
          title: 'Class booked!',
          description: 'You have successfully booked this class.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Booking failed',
          description: response.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to book class'
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsBooking(false)
    }
  }

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMM dd, yyyy h:mm a')
  }

  if (isLoading) {
    return (
      <Container maxW="container.md" py={10}>
        <Flex justifyContent="center" alignItems="center" height="300px">
          <Spinner size="xl" color="brand.500" thickness="4px" />
        </Flex>
      </Container>
    )
  }

  if (error || !fitnessClass) {
    return (
      <Container maxW="container.md" py={10}>
        <Box
          textAlign="center"
          p={10}
          borderRadius="lg"
          bg={errorBg}
          borderWidth="1px"
          borderColor="red.200"
        >
          <Icon as={FaDumbbell} boxSize={12} color="red.500" mb={4} />
          <Heading size="md" color="red.500" mb={4}>
            {error || 'Class not found'}
          </Heading>
          <Button
            leftIcon={<ChevronLeftIcon />}
            colorScheme="brand"
            onClick={() => navigate('/classes')}
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
            transition="all 0.2s"
          >
            Back to Classes
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <MotionContainer
      maxW="container.md"
      py={10}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <MotionBox
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          leftIcon={<ChevronLeftIcon />}
          variant="ghost"
          mb={6}
          onClick={() => navigate('/classes')}
          color="brand.500"
          _hover={{ bg: 'brand.50' }}
        >
          Back to Classes
        </Button>
      </MotionBox>

      <MotionCard
        borderRadius="xl"
        overflow="hidden"
        boxShadow="lg"
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Box bg={headerBg} p={8}>
          <Heading as="h1" size="xl" mb={3} color="brand.700">
            {fitnessClass.name}
          </Heading>

          <HStack spacing={3} mb={3}>
            {fitnessClass.category && (
              <Badge
                colorScheme="brand"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="sm"
              >
                {fitnessClass.category.name}
              </Badge>
            )}
            <Tag size="md" colorScheme="accent" borderRadius="full" px={3}>
              Limited Spots
            </Tag>
          </HStack>

          <Text color={secondaryTextColor} fontSize="md">
            Join us for this exciting fitness class designed to help you reach
            your fitness goals.
          </Text>
        </Box>

        <Divider borderColor={borderColor} />

        <CardBody py={8}>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={8}>
            <GridItem>
              <VStack spacing={6} align="stretch">
                <MotionBox
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Flex align="center">
                    <Icon
                      as={FaCalendarAlt}
                      color="brand.500"
                      boxSize={5}
                      mr={4}
                    />
                    <Box>
                      <Text
                        fontWeight="semibold"
                        fontSize="lg"
                        color={textColor}
                      >
                        Date
                      </Text>
                      <Text color={secondaryTextColor}>
                        {format(
                          new Date(fitnessClass.startsAt),
                          'EEEE, MMMM dd, yyyy'
                        )}
                      </Text>
                    </Box>
                  </Flex>
                </MotionBox>

                <MotionBox
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Flex align="center">
                    <Icon as={FaClock} color="brand.500" boxSize={5} mr={4} />
                    <Box>
                      <Text
                        fontWeight="semibold"
                        fontSize="lg"
                        color={textColor}
                      >
                        Time
                      </Text>
                      <Text color={secondaryTextColor}>
                        {format(new Date(fitnessClass.startsAt), 'h:mm a')} -{' '}
                        {format(new Date(fitnessClass.endsAt), 'h:mm a')}
                      </Text>
                    </Box>
                  </Flex>
                </MotionBox>
              </VStack>
            </GridItem>

            <GridItem>
              <VStack spacing={6} align="stretch">
                <MotionBox
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <Flex align="center">
                    <Icon as={FaUser} color="accent.500" boxSize={5} mr={4} />
                    <Box>
                      <Text
                        fontWeight="semibold"
                        fontSize="lg"
                        color={textColor}
                      >
                        Instructor
                      </Text>
                      <Text color={secondaryTextColor}>
                        {fitnessClass.instructor?.name || 'Not specified'}
                      </Text>
                    </Box>
                  </Flex>
                </MotionBox>

                <MotionBox
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <Flex align="center">
                    <Icon
                      as={FaMapMarkerAlt}
                      color="accent.500"
                      boxSize={5}
                      mr={4}
                    />
                    <Box>
                      <Text
                        fontWeight="semibold"
                        fontSize="lg"
                        color={textColor}
                      >
                        Location
                      </Text>
                      <Text color={secondaryTextColor}>
                        Main Fitness Studio
                      </Text>
                    </Box>
                  </Flex>
                </MotionBox>
              </VStack>
            </GridItem>
          </Grid>

          <MotionBox
            mt={8}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Text fontWeight="semibold" fontSize="lg" mb={2} color={textColor}>
              About this class
            </Text>
            <Text color={secondaryTextColor}>
              This class is designed to help you improve your fitness level and
              achieve your health goals.
            </Text>
          </MotionBox>
        </CardBody>

        <Divider borderColor={borderColor} />

        <Box p={8}>
          <Button
            colorScheme="brand"
            size="lg"
            width="100%"
            height="60px"
            fontSize="md"
            onClick={handleBookClass}
            isLoading={isBooking}
            _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
            transition="all 0.2s"
            borderRadius="lg"
          >
            Book This Class
          </Button>
        </Box>
      </MotionCard>
    </MotionContainer>
  )
}

export default ClassDetails

import { useEffect } from 'react'
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  HStack,
  useColorModeValue,
  Icon,
  Badge,
  Divider,
  Avatar,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { Link as RouterLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FaDumbbell,
  FaCalendarCheck,
  FaChartLine,
  FaUserFriends,
  FaRunning,
  FaMedal,
  FaHeartbeat,
} from 'react-icons/fa'

// Define the pulse animation
const pulseAnimation = keyframes`
  0% { transform: scale(1); opacity: 0.15; }
  50% { transform: scale(1.03); opacity: 0.2; }
  100% { transform: scale(1); opacity: 0.15; }
`

// Create motion components
const MotionBox = motion(Box)
const MotionFlex = motion(Flex)
const MotionText = motion(Text)
const MotionHeading = motion(Heading)
const MotionImage = motion(Image)

const LandingPage = () => {
  const bgGradient = useColorModeValue(
    'linear(to-r, brand.600, accent.500)',
    'linear(to-r, brand.700, accent.600)'
  )
  const cardBg = useColorModeValue('white', 'gray.800')
  const cardBorder = useColorModeValue('neutral.100', 'gray.700')
  const textColor = useColorModeValue('neutral.700', 'neutral.200')
  const highlightColor = useColorModeValue('accent.500', 'accent.400')

  // Preload images
  useEffect(() => {
    const heroImage = new window.Image()
    heroImage.src =
      'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'

    const ctaImage = new window.Image()
    ctaImage.src =
      'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'

    // Preload feature card images
    const featureImages = [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1581122584612-713f89daa8eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1551033406-611cf9a28f67?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
    ]

    featureImages.forEach((src) => {
      const img = new window.Image()
      img.src = src
    })
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 0.5,
        when: 'beforeChildren',
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
      },
    },
  }

  return (
    <MotionBox
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ width: '100%' }}
    >
      {/* Hero Section */}
      <Box
        w="full"
        position="relative"
        overflow="hidden"
        mb={16}
        h={{ base: '100vh', md: '90vh' }}
      >
        {/* Background Image - Simple direct approach */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={-1}
          backgroundImage="url('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
          backgroundSize="cover"
          backgroundPosition="center"
          filter="brightness(0.6)"
        />
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={-1}
          bgGradient="linear(to-b, blackAlpha.700, blackAlpha.500)"
        />

        {/* Content */}
        <Flex
          direction="column"
          align="center"
          justify="center"
          h="full"
          px={{ base: 4, md: 8 }}
          textAlign="center"
        >
          <MotionBox variants={itemVariants}>
            <Badge
              colorScheme="accent"
              fontSize="sm"
              mb={4}
              px={4}
              py={1}
              borderRadius="full"
            >
              Fitness Made Easy
            </Badge>
          </MotionBox>

          <MotionHeading
            as="h1"
            fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
            fontWeight="bold"
            color="white"
            mb={4}
            variants={itemVariants}
          >
            Your Path to{' '}
            <Text as="span" color={highlightColor}>
              Wellness
            </Text>{' '}
            Begins Here
          </MotionHeading>

          <MotionText
            maxW="800px"
            fontSize={{ base: 'lg', md: 'xl' }}
            color="gray.200"
            mb={8}
            variants={itemVariants}
          >
            Book fitness classes, track your progress, and achieve your health
            goals with our comprehensive fitness platform.
          </MotionText>

          <MotionBox variants={itemVariants}>
            <HStack spacing={4}>
              <Button
                as={RouterLink}
                to="/register"
                size="lg"
                height="60px"
                px={8}
                fontSize="lg"
                fontWeight="bold"
                variant="gradient"
                boxShadow="0 4px 20px rgba(0, 0, 0, 0.15)"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 25px rgba(0, 0, 0, 0.2)',
                }}
                transition="all 0.3s ease"
              >
                Get Started Today
              </Button>
              <Button
                as={RouterLink}
                to="/login"
                size="lg"
                height="60px"
                px={8}
                fontSize="lg"
                fontWeight="bold"
                variant="outline"
                color="white"
                borderColor="white"
                _hover={{
                  transform: 'translateY(-2px)',
                  bg: 'whiteAlpha.200',
                }}
                transition="all 0.3s ease"
              >
                Sign In
              </Button>
            </HStack>
          </MotionBox>
        </Flex>
      </Box>

      <Container maxW="container.xl" px={{ base: 4, md: 8 }}>
        <VStack spacing={20} mb={20}>
          {/* Features Section */}
          <MotionBox
            w="full"
            pt={8}
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <VStack spacing={5} mb={16} textAlign="center">
              <Badge colorScheme="brand" px={4} py={1} borderRadius="full">
                Features
              </Badge>
              <Heading fontSize={{ base: '2xl', md: '3xl' }}>
                Everything You Need to Succeed
              </Heading>
              <Text color={textColor} maxW="800px">
                FitBook provides all the tools you need to reach your fitness
                goals, from class booking to progress tracking.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mb={16}>
              <FeatureCard
                title="Diverse Class Selection"
                text="Choose from a wide variety of classes tailored to your preferences and fitness level."
                icon={FaDumbbell}
                delayIndex={0}
                imgSrc="https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              />
              <FeatureCard
                title="Easy Booking System"
                text="Book your favorite classes with just a few clicks, no hassle or wait times."
                icon={FaCalendarCheck}
                delayIndex={1}
                imgSrc="https://images.unsplash.com/photo-1581122584612-713f89daa8eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              />
              <FeatureCard
                title="Progress Tracking"
                text="Monitor your fitness journey with detailed insights and milestone tracking."
                icon={FaChartLine}
                delayIndex={2}
                imgSrc="https://images.unsplash.com/photo-1551033406-611cf9a28f67?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
              />
            </SimpleGrid>
          </MotionBox>

          {/* Benefits Section */}
          <MotionBox
            w="full"
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <VStack spacing={5} mb={16} textAlign="center">
              <Badge colorScheme="green" px={4} py={1} borderRadius="full">
                Benefits
              </Badge>
              <Heading fontSize={{ base: '2xl', md: '3xl' }}>
                Transform Your Fitness Journey
              </Heading>
              <Text color={textColor} maxW="800px">
                Experience the advantages of our comprehensive fitness platform
                designed for results
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} mb={16}>
              <BenefitCard
                icon={FaRunning}
                title="Guided Workouts"
                description="Access professional instructor-led classes tailored to your fitness level"
                color="brand.500"
              />
              <BenefitCard
                icon={FaHeartbeat}
                title="Health Monitoring"
                description="Track your progress with detailed metrics and personalized insights"
                color="accent.500"
              />
              <BenefitCard
                icon={FaUserFriends}
                title="Community Support"
                description="Join a community of fitness enthusiasts who motivate each other"
                color="purple.500"
              />
              <BenefitCard
                icon={FaMedal}
                title="Achievement System"
                description="Earn rewards and badges as you reach milestones in your fitness journey"
                color="green.500"
              />
            </SimpleGrid>
          </MotionBox>

          {/* Testimonials Section */}
          <MotionBox
            w="full"
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <VStack spacing={5} mb={16} textAlign="center">
              <Badge colorScheme="accent" px={4} py={1} borderRadius="full">
                Testimonials
              </Badge>
              <Heading fontSize={{ base: '2xl', md: '3xl' }}>
                What Our Members Say
              </Heading>
              <Text color={textColor} maxW="800px">
                Join thousands of satisfied members who have transformed their
                fitness routines with FitBook.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <TestimonialCard
                name="Sarah Johnson"
                role="Yoga Enthusiast"
                image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
                content="FitBook has completely transformed my fitness routine. The variety of classes and ease of booking keeps me motivated."
                delayIndex={0}
              />
              <TestimonialCard
                name="Michael Chen"
                role="Fitness Professional"
                image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
                content="As a fitness instructor, I love how FitBook makes it easy to manage my classes and connect with my students."
                delayIndex={1}
              />
              <TestimonialCard
                name="Emily Rodriguez"
                role="Marathon Runner"
                image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
                content="The flexibility and variety of classes available has helped me improve my endurance and overall fitness level."
                delayIndex={2}
              />
            </SimpleGrid>
          </MotionBox>

          {/* CTA Section */}
          <MotionBox
            w="full"
            variants={fadeInVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            <Box my={20} position="relative" py={20} overflow="hidden">
              {/* Background Image */}
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                zIndex={-1}
                backgroundImage="url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
                backgroundSize="cover"
                backgroundPosition="center"
                filter="brightness(0.6)"
              />
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                zIndex={-1}
                bgGradient="linear(to-b, blackAlpha.700, blackAlpha.600)"
              />
              <Box position="relative" zIndex={1}>
                <VStack spacing={6} maxW="800px" mx="auto">
                  <Heading color="white" fontSize={{ base: '2xl', md: '4xl' }}>
                    Ready to Transform Your Fitness Journey?
                  </Heading>
                  <Text
                    color="white"
                    fontSize={{ base: 'md', md: 'lg' }}
                    mb={4}
                  >
                    Join thousands of members who are achieving their fitness
                    goals with FitBook.
                  </Text>
                  <HStack spacing={4}>
                    <Button
                      as={RouterLink}
                      to="/register"
                      size="lg"
                      bg="white"
                      color="brand.500"
                      _hover={{
                        bg: 'gray.100',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 25px rgba(0, 0, 0, 0.2)',
                      }}
                      boxShadow="0 4px 20px rgba(0, 0, 0, 0.15)"
                      px={8}
                      fontSize="md"
                      height="60px"
                      transition="all 0.3s ease"
                    >
                      Sign Up Now
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/login"
                      size="lg"
                      variant="outline"
                      color="white"
                      borderColor="white"
                      _hover={{
                        bg: 'whiteAlpha.200',
                        transform: 'translateY(-2px)',
                      }}
                      px={8}
                      fontSize="md"
                      height="60px"
                      transition="all 0.3s ease"
                    >
                      Login
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            </Box>
          </MotionBox>
        </VStack>
      </Container>
    </MotionBox>
  )
}

const FeatureCard = ({
  title,
  text,
  icon,
  delayIndex,
  imgSrc,
}: {
  title: string
  text: string
  icon: React.ElementType
  delayIndex: number
  imgSrc: string
}) => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const cardBorder = useColorModeValue('neutral.100', 'gray.700')
  const textColor = useColorModeValue('neutral.700', 'neutral.200')

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: delayIndex * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Box
        borderRadius="xl"
        overflow="hidden"
        bg={cardBg}
        boxShadow="lg"
        height="100%"
        position="relative"
        borderWidth="1px"
        borderColor={cardBorder}
        transition="all 0.3s ease"
        _hover={{
          transform: 'translateY(-8px)',
          boxShadow: 'xl',
        }}
      >
        <Box h="200px" overflow="hidden">
          <Image
            src={imgSrc}
            alt={title}
            objectFit="cover"
            w="full"
            h="full"
            transition="transform 0.5s"
            _groupHover={{ transform: 'scale(1.05)' }}
          />
        </Box>
        <VStack p={6} align="start" spacing={4}>
          <Flex
            borderRadius="full"
            w="40px"
            h="40px"
            align="center"
            justify="center"
            bg="brand.50"
            color="brand.500"
          >
            <Icon as={icon} boxSize={5} />
          </Flex>
          <Heading as="h3" size="md">
            {title}
          </Heading>
          <Text color={textColor}>{text}</Text>
        </VStack>
      </Box>
    </MotionBox>
  )
}

const BenefitCard = ({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ElementType
  title: string
  description: string
  color: string
}) => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('neutral.100', 'gray.700')
  const textColor = useColorModeValue('neutral.700', 'neutral.200')

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Flex
        p={6}
        borderRadius="xl"
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow="md"
        align="center"
        transition="all 0.3s"
        _hover={{
          transform: 'translateY(-5px)',
          boxShadow: 'lg',
        }}
      >
        <Flex
          borderRadius="full"
          w="60px"
          h="60px"
          align="center"
          justify="center"
          bg={`${color}10`}
          color={color}
          mr={5}
          flexShrink={0}
        >
          <Icon as={icon} boxSize={6} />
        </Flex>
        <Box>
          <Heading size="md" mb={2}>
            {title}
          </Heading>
          <Text color={textColor}>{description}</Text>
        </Box>
      </Flex>
    </MotionBox>
  )
}

const TestimonialCard = ({
  name,
  role,
  image,
  content,
  delayIndex,
}: {
  name: string
  role: string
  image: string
  content: string
  delayIndex: number
}) => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const cardBorder = useColorModeValue('neutral.100', 'gray.700')
  const textColor = useColorModeValue('neutral.700', 'neutral.200')

  return (
    <MotionBox
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: delayIndex * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Flex
        direction="column"
        p={8}
        borderRadius="xl"
        bg={cardBg}
        boxShadow="lg"
        borderWidth="1px"
        borderColor={cardBorder}
        position="relative"
        _before={{
          content: '""',
          position: 'absolute',
          top: 4,
          left: 4,
          width: '40px',
          height: '40px',
          borderRadius: 'md',
          bg: useColorModeValue('brand.50', 'gray.700'),
          zIndex: 0,
        }}
      >
        <Text
          position="relative"
          fontStyle="italic"
          mb={6}
          color={textColor}
          zIndex={1}
        >
          "{content}"
        </Text>

        <HStack mt="auto">
          <Avatar src={image} name={name} size="md" />
          <Box>
            <Text fontWeight="bold">{name}</Text>
            <Text fontSize="sm" color="neutral.500">
              {role}
            </Text>
          </Box>
        </HStack>
      </Flex>
    </MotionBox>
  )
}

export default LandingPage

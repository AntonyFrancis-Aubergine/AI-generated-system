import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  Stack,
  Image,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

const NotFound = () => {
  return (
    <Container centerContent py={20}>
      <Stack direction="column" align="center" spacing={6} textAlign="center">
        <Image
          src="https://img.icons8.com/fluency/240/null/error-cloud.png"
          alt="404 Not Found"
          boxSize={{ base: '150px', md: '200px' }}
          opacity={0.8}
        />
        <Heading as="h1" size="xl">
          404 - Page Not Found
        </Heading>
        <Text fontSize="lg" color="gray.600" maxW="md">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </Text>
        <Box pt={4}>
          <Button as={RouterLink} to="/" colorScheme="teal" size="lg">
            Return Home
          </Button>
        </Box>
      </Stack>
    </Container>
  )
}

export default NotFound

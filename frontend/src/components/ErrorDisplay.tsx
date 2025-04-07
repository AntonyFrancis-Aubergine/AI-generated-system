import React, { useEffect } from "react";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  CloseButton,
  Collapse,
  useDisclosure,
  useColorModeValue,
  Flex,
  BoxProps,
} from "@chakra-ui/react";

interface ErrorDisplayProps {
  /** Error message to display */
  error: string | null;
  /** Optional title for the error */
  title?: string;
  /** Function to clear the error (optional) */
  onClear?: () => void;
  /** Whether to show the close button */
  closable?: boolean;
  /** Whether to automatically close after a timeout */
  autoClose?: boolean;
  /** Timeout in ms for auto-close (default: 5000ms) */
  autoCloseTimeout?: number;
  /** Whether this is a form error (more compact display) */
  isFormError?: boolean;
  /** Margin bottom, passed to the container */
  mb?: BoxProps["mb"];
}

const ErrorDisplay = ({
  error,
  title = "Error",
  onClear,
  closable = true,
  autoClose = false,
  autoCloseTimeout = 5000,
  isFormError = false,
  mb,
}: ErrorDisplayProps) => {
  const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true });
  const bgColor = useColorModeValue("red.50", "rgba(254, 178, 178, 0.16)");

  // Auto-close functionality
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (autoClose && error) {
      timeoutId = setTimeout(() => {
        onClose();
        if (onClear) onClear();
      }, autoCloseTimeout);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [autoClose, error, autoCloseTimeout, onClose, onClear]);

  // Don't render anything if there's no error
  if (!error) return null;

  const handleClose = () => {
    onClose();
    if (onClear) onClear();
  };

  // Form error style (more compact)
  if (isFormError) {
    return (
      <Collapse in={isOpen} animateOpacity>
        <Alert
          status="error"
          variant="left-accent"
          my={2}
          py={2}
          size="sm"
          mb={mb}
        >
          <AlertIcon />
          <Flex justify="space-between" width="100%" align="center">
            <AlertDescription fontSize="sm">{error}</AlertDescription>
            {closable && <CloseButton size="sm" onClick={handleClose} />}
          </Flex>
        </Alert>
      </Collapse>
    );
  }

  // Standard error display
  return (
    <Collapse in={isOpen} animateOpacity>
      <Box my={4} mb={mb}>
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          borderRadius="md"
          py={4}
          bg={bgColor}
        >
          <AlertIcon boxSize="24px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            {title}
          </AlertTitle>
          <AlertDescription maxWidth="sm" mb={2}>
            {error}
          </AlertDescription>
          {closable && (
            <CloseButton
              position="absolute"
              right="8px"
              top="8px"
              onClick={handleClose}
            />
          )}
        </Alert>
      </Box>
    </Collapse>
  );
};

export default ErrorDisplay;

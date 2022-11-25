import {
  Button,
  ButtonGroup,
  Box,
  Flex,
  Stack,
  HStack,
  Input,
  Text,
  FormControl,
  FormLabel,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import Colour from "../Colour";
import url from "../url";
import { React, useEffect, useState } from "react";
import axios from "axios";
// import { useRouter } from "next/router";

export default (props) => {
  //   const router = useRouter();
  const { item, isOpen, onClose } = props;
  const toast = useToast();
  const date = new Date(item.end_time).toLocaleDateString();
  const [isSubmit, setIsSubmit] = useState(false);

  const onSubmitClick = () => {
    setIsSubmit(true);
  };

  const onYesClick = async () => {
    console.log(sessionStorage.getItem("staffID"));
    // console.log("invoice", invoice !== null ? invoice.patientdata[0].appointmentID : null)
    axios.post(
      `${url}/api/appointmentComplete`,
      {
        appointmentid:
          invoice !== null ? invoice.patientdata[0].appointmentID : null,
      },
      {
        headers: {
          staffid: sessionStorage.getItem("staffID"),
        },
      }
    );
    toast({
      title: "Success submit.",
      description: "The appointment has been completed.",
      status: "success",
      duration: 3000,
      isClosable: false,
    });
    onClose();
    setIsSubmit(false);
    window.location.reload();
  };

  let line = {
    width: "100%",
    bgColor: "#000",
    marginTop: " 12px",
    marginRight: "12px",
    height: "2px",
    bgColor: Colour.LightGrey,
  };
  let itembox = {
    bgColor: "white",
  };
  let itembox1 = {
    marginTop: " 24px",
    bgColor: "white",
  };

  const infoBlock = (title, info, h = "36px") => {
    return (
      <HStack>
        <Text w="35%">{title}</Text>
        <Flex
          w="60%"
          minH={h}
          border={"2px solid " + Colour.LightGrey}
          padding="4px"
        >
          <Text w="100%">{info}</Text>
        </Flex>
      </HStack>
    );
  };

  const [invoice, setInvoice] = useState(null);
  let sumTotal = 0;

  useEffect(() => {
    const fetchInvoice = async () => {
      let invoice = await axios.get(
        `${url}/api/getInvoice/${item.appointmentID}`
      );
      setInvoice(invoice.data);
      console.log(invoice.data);
    };
    fetchInvoice();
  }, []);
  //   console.log("invoice", invoice !== null ? invoice.patientdata[0].appointmentID : null)

  let table = [];
  for (
    var i = 0;
    i < (invoice !== null ? invoice.totalroom.length : null);
    i++
  ) {
    table.push(
      <Tr>
        <Td>{invoice !== null ? invoice.totalroom[i].roomName : null}</Td>
        <Td>{invoice !== null ? invoice.totalroom[i].price : null}</Td>
        <Td>{invoice !== null ? invoice.totalroom[i].unit : null}</Td>
        <Td>{invoice !== null ? invoice.totalroom[i].R_Total : null}</Td>
      </Tr>
    );
    {
      sumTotal += invoice !== null ? invoice.totalroom[i].R_Total : null;
    }
  }
  for (
    var i = 0;
    i < (invoice !== null ? invoice.totaldevice.length : null);
    i++
  ) {
    table.push(
      <Tr>
        <Td>{invoice !== null ? invoice.totaldevice[i].device_name : null}</Td>
        <Td>
          {invoice !== null ? invoice.totaldevice[i].price_per_unit : null}
        </Td>
        <Td>
          {invoice !== null ? invoice.totaldevice[i].withdrawAmount : null}
        </Td>
        <Td>{invoice !== null ? invoice.totaldevice[i].Total : null}</Td>
      </Tr>
    );
    {
      sumTotal += invoice !== null ? invoice.totaldevice[i].Total : null;
    }
  }
  for (
    var i = 0;
    i < (invoice !== null ? invoice.totalmedicine.length : null);
    i++
  ) {
    table.push(
      <Tr>
        <Td>
          {invoice !== null ? invoice.totalmedicine[i].medicine_name : null}
        </Td>
        <Td>
          {invoice !== null ? invoice.totalmedicine[i].price_per_unit : null}
        </Td>
        <Td>
          {invoice !== null ? invoice.totalmedicine[i].withdrawAmount : null}
        </Td>
        <Td>{invoice !== null ? invoice.totalmedicine[i].Total : null}</Td>
      </Tr>
    );
    {
      sumTotal += invoice !== null ? invoice.totalmedicine[i].Total : null;
    }
  }
  //console.log(sumTotal);
  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Image src="/assets/image/logo-invoice.png" />
          {/* Invoice: {item.appointmentID} */}
          Invoice:{" "}
          {invoice !== null ? invoice.patientdata[0].appointmentID : null}
          <Box sx={line}></Box>
        </ModalHeader>
        {/* <ModalCloseButton /> */}
        <ModalBody mb="16px">
          <Box sx={itembox}>
            <Stack>
              {infoBlock("Date", date)}
              {infoBlock(
                "Name",
                (invoice !== null ? invoice.patientdata[0].firstname : null) +
                  " " +
                  (invoice !== null ? invoice.patientdata[0].lastname : null)
              )}
              {infoBlock(
                "CitizenID",
                invoice !== null ? invoice.patientdata[0].citizenID : null
              )}
            </Stack>
          </Box>

          <Box sx={itembox1}>
            <Stack>
              <Text fontSize="20px" fontWeight="bold" marginBottom="8px">
                Expense Details
              </Text>
              <TableContainer
                border={"1px solid" + Colour.LightGrey}
                borderRadius="12px"
                bgColor={Colour.White}
              >
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>List</Th>
                      <Th>Price</Th>
                      <Th>Unit</Th>
                      <Th>Total</Th>
                    </Tr>
                  </Thead>
                  <Tbody>{table}</Tbody>
                </Table>
              </TableContainer>
            </Stack>
          </Box>
          <Box sx={itembox1}>
            <Stack>
              <Text fontSize="20px" fontWeight="bold" marginBottom="8px">
                Amount to pay
              </Text>
              {infoBlock("Total", sumTotal)}
            </Stack>
          </Box>
        </ModalBody>
        <ModalFooter>
          {/* <Button colorScheme="teal" leftIcon={<CheckIcon />}>
            Dispensed and paid
          </Button> */}
          {isSubmit == false ? (
            <ButtonGroup>
              <Button
                colorScheme="teal"
                leftIcon={<CheckIcon />}
                onClick={() => onSubmitClick()}
              >
                Dispensed and paid
              </Button>
              <Button
                colorScheme="yellow"
                onClick={() => {
                  setIsSubmit(false), onClose();
                }}
              >
                Cancel
              </Button>
            </ButtonGroup>
          ) : (
            <>
              <Text marginRight="16px">Submit?</Text>
              <ButtonGroup>
                <Button colorScheme="teal" onClick={() => onYesClick()}>
                  Yes
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => {
                    setIsSubmit(false)
                  }}
                >
                  No
                </Button>
              </ButtonGroup>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

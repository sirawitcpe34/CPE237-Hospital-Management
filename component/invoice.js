import { Button, Box, Flex, Stack, HStack, Input, Text, FormControl, FormLabel,Image,
    Modal,ModalOverlay,ModalContent,ModalHeader,ModalFooter,ModalBody,ModalCloseButton, Textarea,
  } from '@chakra-ui/react'
import {Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer} from '@chakra-ui/react'
import Colour from '../Colour'
import url from '../url'
import { React, useEffect, useState } from "react"
import axios from "axios"

export default (props) => {
    const { item, isOpen, onClose } = props
    const date = new Date(item.end_time).toLocaleDateString()

    let line = {
        width: '100%',
        bgColor: '#000',
        marginTop: ' 12px',
        marginRight: '12px',
        height: '2px',
        bgColor: Colour.LightGrey
    }
    let itembox = {
        bgColor: "white",
    }
    let itembox1 = {
        marginTop: ' 24px',
        bgColor: "white",
    }

    const infoBlock = (title, info, h='36px') => {
        return (
            <HStack>
                <Text w='35%'>{title}</Text>
                <Flex w='60%' minH={h} border={'2px solid ' + Colour.LightGrey} padding='4px'>
                <Text w='100%'>{info}</Text>
                </Flex>
            </HStack>
        );
    }

    const [invoice, setInvoice] = useState(null)
    let sumTotal = 0

    useEffect(() =>
    {
      const fetchInvoice = async () =>
      {
        let invoice = await axios.get(`${url}/api/getInvoice/${item.appointmentID}`)
        setInvoice(invoice.data)
        console.log(invoice.data)
      }
      fetchInvoice()
    },[])

    let table = [];
    for (var i = 0; i < (invoice !== null ? invoice.totalroom.length : null); i++) {
        table.push(
          <Tr>
            <Td>{invoice !== null ? invoice.totalroom[i].roomName : null}</Td>
            <Td>{invoice !== null ? invoice.totalroom[i].price : null}</Td>
            <Td>{invoice !== null ? invoice.totalroom[i].unit : null}</Td>
            <Td>{invoice !== null ? invoice.totalroom[i].R_Total : null}</Td>
          </Tr>
        );
        {sumTotal +=  (invoice !== null ? invoice.totalroom[i].R_Total : null)} 
      }
    for (var i = 0; i < (invoice !== null ? invoice.totaldevice.length : null); i++) {
        table.push(
          <Tr>
            <Td>{invoice !== null ? invoice.totaldevice[i].device_name : null}</Td>
            <Td>{invoice !== null ? invoice.totaldevice[i].price_per_unit : null}</Td>
            <Td>{invoice !== null ? invoice.totaldevice[i].withdrawAmount : null}</Td>
            <Td>{invoice !== null ? invoice.totaldevice[i].Total : null}</Td>
          </Tr>
        );
        {sumTotal += (invoice !== null ? invoice.totaldevice[i].Total : null)} 
      }
    for (var i = 0; i < (invoice !== null ? invoice.totalmedicine.length : null); i++) {
        table.push(
          <Tr>
            <Td>{invoice !== null ? invoice.totalmedicine[i].medicine_name : null}</Td>
            <Td>{invoice !== null ? invoice.totalmedicine[i].price_per_unit : null}</Td>
            <Td>{invoice !== null ? invoice.totalmedicine[i].withdrawAmount : null}</Td>
            <Td>{invoice !== null ? invoice.totalmedicine[i].Total : null}</Td>
          </Tr>
        );
        {sumTotal += (invoice !== null ? invoice.totalmedicine[i].Total : null)} 
      }
      //console.log(sumTotal);
    return(
        <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Image src='/assets/image/logo-invoice.png'/>     
                    {/* Invoice: {item.appointmentID} */}
                    Invoice: {invoice !== null ? invoice.patientdata[0].appointmentID : null}
                    <Box sx={line}></Box>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody mb='16px'>
                    
                    <Box sx={itembox}>
                    <Stack>
                        {infoBlock("Date", date)}
                        {infoBlock("Name", (invoice !== null ? invoice.patientdata[0].firstname : null) + 
                            ' ' + (invoice !== null ? invoice.patientdata[0].lastname : null))}
                        {infoBlock("CitizenID", invoice !== null ? invoice.patientdata[0].citizenID : null)}
                    </Stack>
                    </Box>

                    <Box sx={itembox1}>
                    <Stack>
                    <Text fontSize="20px" fontWeight="bold" marginBottom="8px">
                     Expense Details
                    </Text>
                    <TableContainer border={'1px solid' + Colour.LightGrey} borderRadius='12px' bgColor={Colour.White} >
                            <Table variant='simple'>
                                <Thead>
                                <Tr>
                                    <Th>List</Th>
                                    <Th>Price</Th>
                                    <Th>Unit</Th>
                                    <Th>Total</Th>
                                </Tr>
                                </Thead>
                                <Tbody>
                                    {table}
                                </Tbody>
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

            </ModalContent>
        </Modal>
    )
}
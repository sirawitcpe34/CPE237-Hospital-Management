import { useRouter } from 'next/router'
import
    {
        Avatar, Box, Button, Checkbox, Flex, FormControl, FormErrorMessage, FormLabel, IconButton, Input, InputGroup, InputLeftElement, 
    Menu,MenuButton,MenuList,MenuItem,MenuItemOption,MenuGroup,MenuOptionGroup,MenuDivider,
    NumberInput,NumberInputField,NumberInputStepper,NumberIncrementStepper,NumberDecrementStepper,
    InputRightElement, Heading, HStack, VStack, Radio, Select, SimpleGrid, Text, Textarea, Stack, RadioGroup, ButtonGroup,
    useToast 
    } from '@chakra-ui/react'
import {
        AutoComplete,
        AutoCompleteInput,
        AutoCompleteItem,
        AutoCompleteList,
      } from "@choc-ui/chakra-autocomplete";
import { ChevronDownIcon, AddIcon, CloseIcon } from '@chakra-ui/icons'
import axios from 'axios'
import Colour from '../../Colour'
import { useState } from 'react'
import url from '../../url'

export default (props) =>
{
    const { data } = props
    const router = useRouter()
    const toast = useToast()

    const orderID = router.query.orderID

    console.log(props)

    let container = {
        width: '100vw',
        paddingLeft: '360px',
        marginTop: '64px',
        bgColor: Colour.AlmostWhite,
    }

    let container2 = {
        flexDirection: 'column',
        gap: '4',
        maxWidth: 'container.lg',
        width: '100%',
        marginLeft: '360px',
        marginTop: '32px',
    }

    let container3 = {
        border: '1px solid',
        borderColor: Colour.LightGrey,
        borderRadius: '12px',
        flexDirection: 'column',
        gap: '4',
        width: '100%'
    }

    let line = {
        width: '90%',
        marginRight: '4000px',
        paddingLeft: '360px',
        bgColor: '#000',
        marginTop: ' 12px',
        height: '2px',
        bgColor: Colour.LightGrey
    }

    let fileButton = {
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        borderRadius: 'md',
        bg: Colour.Orange,
        // color: 'white',
        px: 4,
        h: 8,
        _hover: { filter: 'brightness(0.9)' },
        transition: 'all 0.2s cubic-bezier(.08,.52,.52,1)',
    }

    let summitButton = {
        bg: Colour.Orange,
        _hover: { filter: 'brightness(0.9)' },
        transition: 'all 0.2s cubic-bezier(.08,.52,.52,1)',
        width: '100px',
    }

    const [error, setError] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [isConfirm, setIsConfirm] = useState(false)
    const [dateInStock, setDateInStock] = useState('')
    const [organization, setOrganization] = useState([{"organizationID": "",
                                                        "organizationName": "",
                                                    }])

    const [medicineList, setMedicineList] = useState([{"medicineID": "",
                                                "name": "",
                                                "price": "",
                                                "amount": "",
                                            }])
    const [deviceList, setDeviceList] = useState([{"deviceID": "",
                                            "name": "",
                                            "price": "",
                                            "amount": "",
                                        }])

    const buttonStyle = (bgColor, textColor) => {
        return {
            bg: bgColor,
            color: textColor,
            _hover: {filter: 'brightness(0.9)'},
            transition:'all 0.2s cubic-bezier(.08,.52,.52,1)',
        }
    }

    const onConfirmClick = () => {
        setIsConfirm(true)
    }
    console.log(data)
    // console.log(new Date().toLocaleDateString("sv-SE"))
    return (
        <div style={{ backgroundColor: Colour.AlmostWhite }}>
            <Box sx={container} >
                <Heading>
                    Order ID: {orderID} 
                </Heading>
                <Box sx={line}></Box>
            </Box>
            <Flex sx={container2}>
                <Flex sx={container3} padding='16px'>
                        <VStack spacing={4} align='flex-start'>
                            <HStack w='100%'>
                                <Heading as='h4' size='sm' w='120px'>Organization</Heading>
                                <Box sx={container3} padding='8px' minW='inherit'>
                                    <Text>{data.organization_name}</Text>
                                </Box>
                            </HStack>
                            <HStack w='100%'>
                                <Heading as='h4' size='sm' w='120px'>Date order</Heading>
                                <Box sx={container3} padding='8px' maxW='200px'>
                                    <Text>{new Date(data.dateOrder).toLocaleDateString()}</Text>
                                </Box>
                            </HStack>
                            <HStack w='100%'>
                                <Heading as='h4' size='sm' w='120px'>Date in stock</Heading>
                                <Box sx={container3} padding='8px' maxW='200px'>
                                    <Text>{new Date(data.dateInStock).toLocaleDateString()}</Text>
                                </Box>
                            </HStack>
                            
                            <Heading as='h4' size='sm'>Medicine</Heading>
                            { data && data.medicine.length ?
                                data.medicine.map((item, index) => {
                                    return (
                                        <HStack spacing={4} w='100%' align='flex-start'>
                                            <FormControl>
                                                <FormLabel>Name</FormLabel>
                                                <Box sx={container3} padding='8px'>
                                                    <Text isTruncated>{item.medicine_name}</Text>
                                                </Box>
                                            </FormControl>
                                            <FormControl w='200px' >
                                                <FormLabel>Price per unit</FormLabel>
                                                <Box sx={container3} padding='8px'>
                                                    <Text>{item.o_priceperunit}</Text>
                                                </Box>
                                            </FormControl>
                                            <FormControl w='200px'>
                                                <FormLabel>Amount</FormLabel>
                                                <Box sx={container3} padding='8px'>
                                                    <Text>{item.amount}</Text>
                                                </Box>
                                            </FormControl>
                                        </HStack>
                                    );
                                }) :
                                <Text>None</Text>
                            }

                            <Heading as='h4' size='sm'>Device</Heading>
                            { data && data.device.length ?
                                data.device.map((item, index) => {
                                    return (
                                        <HStack spacing={4} w='100%' align='flex-start'>
                                            <FormControl>
                                                <FormLabel>Name</FormLabel>
                                                <Box sx={container3} padding='8px'>
                                                    <Text isTruncated>{item.device_name}</Text>
                                                </Box>
                                            </FormControl>
                                            <FormControl w='200px' >
                                                <FormLabel>Price per unit</FormLabel>
                                                <Box sx={container3} padding='8px'>
                                                    <Text>{item.o_priceperunit}</Text>
                                                </Box>
                                            </FormControl>
                                            <FormControl w='200px'>
                                                <FormLabel>Amount</FormLabel>
                                                <Box sx={container3} padding='8px'>
                                                    <Text>{item.amount}</Text>
                                                </Box>
                                            </FormControl>
                                        </HStack>
                                    );
                                }) :
                                <Text>None</Text>
                            }
                        </VStack>
                </Flex>
            </Flex>
        </div>
    )
}

export const getStaticPaths = async () => {
    const res = await axios.get(`${url}/api/getOrder/path`);
    const paths = res.data.map((item) => ({
        params: {
            orderID: item.orderID
        }
    }));
    return { paths, fallback: false };
}

export const getStaticProps = async (context)=>{
    const id = context.params.orderID;
    const data = await axios.get(`${url}/api/getOrder/${id}`);
    return {
        props: {
            data: JSON.parse(JSON.stringify(data.data)),
            // data: data.data[0],
            // medicine: medicine.data,
            // device: device.data
        }
    }
}

// export const getStaticProps = async (context) =>
// {
//     const organization = await axios.get(`${url}/api/getOrganization`)
//     const medicine = await axios.get(`${url}/api/getNameMedicine`)
//     const device = await axios.get(`${url}/api/getNameDevice`)
//     return {
//         props: {
//             organization: organization.data,
//             medicine: medicine.data,
//             device: device.data
//         },
//         revalidate: 60
//     }
// }
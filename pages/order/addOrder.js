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
import { setISODay } from 'date-fns';

export default (props) =>
{
    const { organizationData, medicineData, deviceData } = props
    const router = useRouter()
    const toast = useToast()

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
        width: '100%',
        padding: '16px',
        bgColor: Colour.White,
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

    const [isConfirm, setIsConfirm] = useState(false)
    const [isSend, setIsSend] = useState(false)
    const [error, setError] = useState(false)
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

    const del = (type, i) => {
        if (type) {
            let temp = [...deviceList]
            temp.splice(i, 1)
            setDeviceList(temp)
        }
        else {
            let temp = [...medicineList]
            temp.splice(i, 1)
            setMedicineList(temp)
        }
    }

    const setName = (type, name, i, id = '') => {
        // console.log(id, name)
        if (type) {
            let temp = [...deviceList]
            temp[i].name = name
            temp[i].deviceID = id
            setDeviceList(temp)
        }
        else {
            let temp = [...medicineList]
            temp[i].medicineID = id
            temp[i].name = name
            setMedicineList(temp)
        }
    }

    const setPrice = (type, price, i) => {
        if (type) {
            let temp = [...deviceList]
            temp[i].price = price
            setDeviceList(temp)
        }
        else {
            let temp = [...medicineList]
            temp[i].price = price
            setMedicineList(temp)
        }
    }

    const setAmount = (type, num, i) => {
        if (type) {
            let temp = [...deviceList]
            temp[i].amount = num
            setDeviceList(temp)
        }
        else {
            let temp = [...medicineList]
            temp[i].amount = num
            setMedicineList(temp)
        }
    }

    const onConfirmClick = () => {
        setIsConfirm(true)
    }

    const onYesClick = () => {
        let medicine = []
        let device = []
        let error_m = ['Some fields are empty. ']
        let ch = true
        let ch2 = true
        let ch3 = true
        let ch4 = true
        let ch5 = true
        medicineList.forEach(item => {
            if (!(item.medicineID === '' && item.name === ''
                && item.price === '' && item.amount === '')) {
                medicine.push(item)
            }
        })
        medicine.forEach(item => {
            if (item.medicineID === '' || item.amount === '' || item.price === '') {
                // console.log('cant submit')
                ch = false
            }
        })
        if(!ch)
            error_m.push('[Medicine] ')
        deviceList.forEach(item => {
            if (!(item.deviceID === '' && item.name === '' 
                && item.price === '' && item.amount === '')) {
                device.push(item)
            }
        })
        device.forEach(item => {
            if (item.deviceID === '' || item.amount === '' || item.price === '') {
                // console.log('cant submit')
                ch2 = false
            }
        })
        if(!ch2)
            error_m.push('[Device] ')
        if (!organization.organizationName) {
            ch3 = false
            error_m.push('[Organization] ')
        }
        if (!dateInStock) {
            ch5 = false
            error_m.push('[Date in stock] ')
        }
        if (!medicine.length && !device.length)
        {
            ch4 = false
            error_m.push('[Medicine or Device] ')
        }
        console.log(medicine)
        console.log(device)
        if (ch && ch2 && ch3 && ch4 && ch5) {
            console.log('can send')
            let data = {
                "organizationID": organization.organizationID,
                "organizationName": organization.organizationName,
                "dateOrder": new Date().toLocaleDateString("sv-SE"),
                "dateInStock": dateInStock,
                "medicine": medicine,
                "device": device,
            }
            console.log(data)
            axios.post(`${url}/api/addOrder`, data, {headers: {
                staffid: sessionStorage.getItem("staffID")
            }})
                .then(res => {
                    console.log(res)
                    // setRefresh(!refresh)
                })
                .catch(err => {
                    console.log(err)
                })
            toast({
                title: 'Success submit.',
                description: "We've added your order for you.",
                status: 'success',
                duration: 3000,
                isClosable: false,
                
              })
            setIsSend(true)
            setTimeout(() => {
                router.push('/order')
            }, 3000)
        }
        else {
            console.log('cant submit')
            toast({
                title: 'Error submit.',
                description: error_m,
                status: 'error',
                duration: 3000,
                isClosable: false,
                containerStyle: {
                    maxWidth: '700px',
                  },
              })
            setIsConfirm(false)
            setError(true)
        }
    }
    console.log(organization)
    console.log(dateInStock)
    console.log(medicineList)
    console.log(deviceList)
    // console.log(new Date().toLocaleDateString("sv-SE"))
    return (
        <div style={{ backgroundColor: Colour.AlmostWhite }}>
            <Box sx={container} >
                <Heading>
                    Add order
                </Heading>
                <Box sx={line}></Box>
            </Box>
            <Flex sx={container2}>
                <Flex sx={container3}>
                    {/* <Box> */}
                        <VStack spacing={4} align='flex-start'>
                            <FormControl>
                                <FormLabel>Organization</FormLabel>
                                <AutoComplete openOnFocus >
                                    <AutoCompleteInput variant="outline" w='50%'
                                        value={organization.organizationName || ''}
                                        isInvalid={error && !organization.organizationName}
                                        onChange={(e) => {
                                            let id = 0
                                            organizationData.forEach(item => {
                                                if (item.organization_name === e.target.value) {
                                                    id = item.organizationID
                                                }
                                            })
                                            let temp = { organizationID: id, organizationName: e.target.value }
                                            setOrganization(temp)
                                        }}
                                        isDisabled={isConfirm} _disabled={{opacity: 0.8}}
                                    />
                                    <AutoCompleteList>
                                        { props ?
                                            organizationData.map((org, i) => (
                                                <AutoCompleteItem
                                                    key={i}
                                                    value={org.organization_name}
                                                    textTransform="capitalize"
                                                    align="center"
                                                    onClick={() => {
                                                        let temp = { organizationID: org.organizationID, organizationName: org.organization_name }
                                                        setOrganization(temp)
                                                    }}
                                                >
                                                    <Text ml="4">{org.organization_name}</Text>
                                                </AutoCompleteItem>
                                            )) : null 
                                        }
                                    </AutoCompleteList>
                                </AutoComplete>
                            </FormControl>

                            <FormControl>
                                <FormLabel>Date in stock</FormLabel>
                                <Input w='50%' type='date' value={dateInStock}
                                    isDisabled={isConfirm} _disabled={{opacity: 0.8}}
                                    isInvalid={error && !dateInStock}
                                    onChange={(e) => {setDateInStock(e.target.value)}}
                                />
                            </FormControl>

                            <HStack>
                                <Heading as='h4' size='sm'>Medicine</Heading>
                                <Button sx={buttonStyle(Colour.Green, Colour.White)} size='xs' rightIcon={<AddIcon />}
                                    isDisabled={isConfirm} _disabled={{opacity: 0.8}}
                                    onClick={()=>{setMedicineList([...medicineList, 
                                        {"medicineID": "", "name": "", "price": "", "amount": ""}])}}
                                >
                                    Add
                                </Button>
                            </HStack>

                            {
                                medicineList.map((item, index) => {
                                    return (
                                        <HStack spacing={4} w='100%' align='flex-end'>
                                            <FormControl>
                                                <FormLabel>Medicine</FormLabel>
                                                <AutoComplete openOnFocus>
                                                    <AutoCompleteInput variant="outline"
                                                        value={item.name || ''}
                                                        onChange={(e) => setName(0, e.target.value, index)}
                                                        isDisabled={isConfirm} _disabled={{opacity: 0.8}}
                                                        isInvalid={error && !item.medicineID && item.name}
                                                                // T           T
                                                    />
                                                    <AutoCompleteList>
                                                        { props ?
                                                            medicineData.map((med, i) => (
                                                                <AutoCompleteItem
                                                                    key={i}
                                                                    value={med.medicine_name}
                                                                    textTransform="capitalize"
                                                                    align="center"
                                                                    onClick={() => setName(0, med.medicine_name, index, med.medicineID)}
                                                                >
                                                                    <Text ml="4">{med.medicine_name}</Text>
                                                                </AutoCompleteItem>
                                                            )) : null 
                                                        }
                                                    </AutoCompleteList>
                                                </AutoComplete>
                                            </FormControl>
                                            <FormControl w='50%'>
                                                <FormLabel>Price per unit</FormLabel>
                                                <NumberInput min={1}
                                                    isDisabled={isConfirm || !item.medicineID} _disabled={{opacity: 0.8}}
                                                    isInvalid={error && !item.price && item.medicineID}
                                                    value={item.price || ''} 
                                                    onChange={(e)=>{setPrice(0, e, index)}}
                                                >
                                                    <NumberInputField/>
                                                    <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                    </NumberInputStepper>
                                                </NumberInput>
                                            </FormControl>
                                            <FormControl w='50%'>
                                                <FormLabel>Amount</FormLabel>
                                                <NumberInput min={1} precision={0} step={1}
                                                    isDisabled={isConfirm || !item.medicineID} _disabled={{opacity: 0.8}}
                                                    isInvalid={error && !item.amount && item.medicineID}
                                                    value={item.amount || ''}
                                                    onChange={(e)=>{setAmount(0, e, index)}}
                                                >
                                                    <NumberInputField/>
                                                    <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                    </NumberInputStepper>
                                                </NumberInput>
                                            </FormControl>
                                            { index !== 0 ?
                                                <IconButton sx={buttonStyle(Colour.Red, Colour.White)} size='sm' icon={<CloseIcon />} 
                                                    onClick={() => del(0, index)}
                                                /> :
                                                <IconButton sx={buttonStyle(Colour.Red, Colour.White)} size='sm' icon={<CloseIcon />} 
                                                    visibility='hidden'
                                                />
                                            }
                                        </HStack>
                                    );
                                })
                            }

                            <HStack>
                                <Heading as='h4' size='sm'>Device</Heading>
                                <Button sx={buttonStyle(Colour.Green, Colour.White)} size='xs' rightIcon={<AddIcon />}
                                    isDisabled={isConfirm} _disabled={{opacity: 0.8}}
                                    onClick={()=>{setDeviceList([...deviceList, 
                                        {"deviceID": "", "name": "", "price": "", "amount": ""}])}}
                                >
                                    Add
                                </Button>
                            </HStack>

                            {
                                deviceList.map((item, index) => {
                                    return (
                                        <HStack spacing={4} w='100%' align='flex-end'>
                                            <FormControl>
                                                <FormLabel>Device</FormLabel>
                                                <AutoComplete openOnFocus>
                                                    <AutoCompleteInput variant="outline"
                                                        value={item.name || ''}
                                                        onChange={(e) => setName(1, e.target.value, index)}
                                                        isDisabled={isConfirm} _disabled={{opacity: 0.8}}
                                                        isInvalid={error && !item.deviceID && item.name}
                                                    />
                                                    <AutoCompleteList>
                                                        { props ?
                                                            deviceData.map((dev, i) => (
                                                                <AutoCompleteItem
                                                                    key={i}
                                                                    value={dev.device_name}
                                                                    textTransform="capitalize"
                                                                    align="center"
                                                                    onClick={() => setName(1, dev.device_name, index, dev.deviceID)}
                                                                >
                                                                    <Text ml="4">{dev.device_name}</Text>
                                                                </AutoCompleteItem>
                                                            )) : null 
                                                        }
                                                    </AutoCompleteList>
                                                </AutoComplete>
                                            </FormControl>
                                            <FormControl w='50%'>
                                                <FormLabel>Price per unit</FormLabel>
                                                <NumberInput min={1}
                                                    isDisabled={isConfirm || !item.deviceID} _disabled={{opacity: 0.8}}
                                                    isInvalid={error && !item.price && item.deviceID}
                                                    value={item.price || ''} 
                                                    onChange={(e)=>{setPrice(1, e, index)}}
                                                >
                                                    <NumberInputField/>
                                                    <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                    </NumberInputStepper>
                                                </NumberInput>
                                            </FormControl>
                                            <FormControl w='50%'>
                                                <FormLabel>Amount</FormLabel>
                                                <NumberInput min={1}  precision={0} step={1}
                                                    isDisabled={isConfirm || !item.deviceID} _disabled={{opacity: 0.8}}
                                                    isInvalid={error && !item.amount && item.deviceID}
                                                    value={item.amount || ''}
                                                    onChange={(e)=>{setAmount(1, e, index)}}
                                                >
                                                    <NumberInputField/>
                                                    <NumberInputStepper>
                                                    <NumberIncrementStepper />
                                                    <NumberDecrementStepper />
                                                    </NumberInputStepper>
                                                </NumberInput>
                                            </FormControl>
                                            { index !== 0 ?
                                                <IconButton sx={buttonStyle(Colour.Red, Colour.White)} size='sm' icon={<CloseIcon />} 
                                                    onClick={() => del(1, index)}
                                                /> :
                                                <IconButton sx={buttonStyle(Colour.Red, Colour.White)} size='sm' icon={<CloseIcon />} 
                                                    visibility='hidden'
                                                />
                                            }
                                        </HStack>
                                    );
                                })
                            }
                        </VStack>
                    {/* </Box> */}
                </Flex>

                <HStack justify='end'>
                    { !isConfirm ?
                        <ButtonGroup>
                            <Button sx={buttonStyle(Colour.Green, Colour.White)} 
                                onClick={() => onConfirmClick()}
                            >
                                Confirm
                            </Button>
                            <Button sx={buttonStyle(Colour.Red, Colour.White)} 
                                onClick={() => router.push('/order')}
                            >
                                Cancel
                            </Button>
                        </ButtonGroup> :
                        <>
                            <Text>Confirm?</Text>
                            <ButtonGroup>
                                <Button sx={buttonStyle(Colour.Green, Colour.White)} 
                                    onClick={() => onYesClick()} isDisabled={isSend}
                                >
                                    Yes
                                </Button>
                                <Button sx={buttonStyle(Colour.Red, Colour.White)} 
                                    onClick={() => setIsConfirm(false)} isDisabled={isSend}
                                >
                                    No
                                </Button>
                            </ButtonGroup>
                        </>

                    }
                </HStack>
            </Flex>
        </div>
    )
}

// export const getStaticPaths = async () => {
//     const res = await axios.get(`${url}/api/getOrder/path`);
//     const paths = res.data.map((item) => ({
//         params: {
//             orderID: item.orderID
//         }
//     }));
//     return { paths, fallback: false };
// }

export const getServerSideProps = async (context)=>{
    // const id = context.params.orderID;
    const organization = await axios.get(`${url}/api/getOrganization`);
    const medicine = await axios.get(`${url}/api/getMedicine`, {
        headers: {
            "page": 0,       
        }})
    const device = await axios.get(`${url}/api/getDevice`, {
        headers: {
            "page": 0,       
        }})
    return {
        props: {
            organizationData: JSON.parse(JSON.stringify(organization.data)),
            medicineData: JSON.parse(JSON.stringify(medicine.data)),
            deviceData: JSON.parse(JSON.stringify(device.data))
            // data: data.data[0],
            // medicine: medicine.data,
            // device: device.data
        }
    }
}
            
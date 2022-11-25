import {Avatar, Box, Button, Checkbox, Flex, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputLeftElement, 
    Menu,MenuButton,MenuList,MenuItem,MenuItemOption,MenuGroup,MenuOptionGroup,MenuDivider, IconButton,
    NumberInput,NumberInputField,NumberInputStepper,NumberIncrementStepper,NumberDecrementStepper,
    InputRightElement, Heading, HStack, VStack, Radio, Select, SimpleGrid, Text, Textarea, Stack, RadioGroup, ButtonGroup,
    useToast } from '@chakra-ui/react'
import { AddIcon, ArrowBackIcon, ArrowForwardIcon, ChevronDownIcon, CloseIcon, PlusSquareIcon, SearchIcon, SmallCloseIcon } from '@chakra-ui/icons'

import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
  } from "@choc-ui/chakra-autocomplete";

import axios from 'axios'
import Colour from '../../Colour'
import Loading from '../../component/loading'
import { encode, decode } from 'js-base64'
import { useState, useEffect } from 'react'
import {useRouter} from 'next/router'
import url from '../../url'

export default (props) => {
    const { data, medicine, device, diseases } = props
    
    const router = useRouter()
    const toast = useToast()
    const appointmentID = router.query.appointmentID
    console.log(appointmentID)
    console.log(props)

    const [refresh, setRefresh] = useState(false)
    const [selected, setSelected] = useState(false)
    const [isSend, setIsSend] = useState(false)
    const [isSubmit, setIsSubmit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [infoActive, setInfoActive] = useState(true)
    const [file, setFile] = useState(['Profile name', null])
    const [error, setError] = useState(false)
    
    const [symptom, setSymptom] = useState('' || data[0].symptoms)
    const [summary, setSummary] = useState('')
    const [disease, setDisease] = useState([{"diseaseID": "1",
                                            "diseaseName": "No disease",     
                                        }])
    const [medicineList, setMedicineList] = useState([{"medicineID": "",
                                                "name": "",
                                                "price": "",
                                                "amount": "",
                                                "m_amount": "",
                                                "type": "used",//takehome,used
                                                "note": ""
                                            }])
    const [deviceList, setDeviceList] = useState([{"deviceID": "",
                                            "name": "",
                                            "price": "",
                                            "amount": "",
                                            "d_amount": "",
                                            "type": "used",//takehome,used
                                            "note": ""
                                        }])
    const [positionID, setPositionID] = useState(null)

    useEffect(() =>
    {
        const kickOut = () =>
        {
            sessionStorage.clear()
            router.push('/')
            alert('please login again')
        }
        setPositionID(sessionStorage.getItem('positionID'))
        if (sessionStorage.getItem('positionID') == 2)
        {
            kickOut()
        }
    }, [])

    let container = {
        width: '100vw',
        paddingLeft: '360px',
        marginTop: '64px',
        bgColor: Colour.AlmostWhite,
    }

    let container2 = {
        flexDirection: 'column',
        gap: '4',
        maxWidth: 'container.md',
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
        width: '40px',
        bgColor: Colour.LightGrey
    }

    let fileButton = {
        cursor: 'pointer',
        display: 'flex', 
        alignItems: 'center',
        borderRadius: 'md', 
        bg: Colour.LightGrey, 
        // color: 'white',
        px: 4, 
        h: 8,
        _hover: {filter: 'brightness(0.9)'},
        transition:'all 0.2s cubic-bezier(.08,.52,.52,1)',
    }
    
    let infoButton = {
        _hover: {filter: 'brightness(0.9)'},
        transition:'all 0.2s cubic-bezier(.08,.52,.52,1)',
    }

    useEffect(() => {
        console.log('refresh')
    }, [refresh])

    const buttonStyle = (bgColor, textColor) => {
        return {
            bg: bgColor,
            color: textColor,
            _hover: {filter: 'brightness(0.9)'},
            transition:'all 0.2s cubic-bezier(.08,.52,.52,1)',
        }
    }

    const del = (type, i) => {
        if (type === 1) {
            let temp = [...deviceList]
            temp.splice(i, 1)
            setDeviceList(temp)
        }
        else if (type === 0) {
            let temp = [...medicineList]
            temp.splice(i, 1)
            setMedicineList(temp)
        }
        else if (type === 2)
        {
            let temp = [...disease]
            temp.splice(i, 1)
            setDisease(temp)
        }
    }

    const delDisease = (i) => {
        let temp = [...disease]
        temp.splice(i, 1)
        setDeviceList(temp)
    }

    const setCheck = (type, check, i) => {
        if (type) {
            let temp = [...deviceList]
            if (check)
                temp[i].type = 'takehome'
            else
                temp[i].type = 'used'
            setDeviceList(temp)
        }
        else {
            let temp = [...medicineList]
            if (check)
                temp[i].type = 'takehome'
            else
                temp[i].type = 'used'
            setMedicineList(temp)
        }
        // console.log(check, i)
    }

    const setDiseaseIn = (name, i, id = 0) => {
            let temp = [...disease]
            temp[i].diseaseName = name
            temp[i].diseaseID = id
            setDisease(temp)
        
    }

    const setName = (type, name, i, amount = '', price = '', id = '') => {
        // console.log(id, name)
        if (type) {
            let temp = [...deviceList]
            temp[i].name = name
            temp[i].d_amount = amount
            temp[i].deviceID = id
            temp[i].price = price
            setDeviceList(temp)
        }
        else {
            let temp = [...medicineList]
            temp[i].medicineID = id
            temp[i].m_amount = amount
            temp[i].name = name
            temp[i].price = price
            setMedicineList(temp)
        }
    }
    
    const setNum = (type, num, i) => {
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

    const setNote = (type, note, i) => {
        if (type) {
            let temp = [...deviceList]
            temp[i].note = note
            setDeviceList(temp)
        }
        else {
            let temp = [...medicineList]
            temp[i].note = note
            setMedicineList(temp)
        }
    }

    const onSummitClick = () => {
        setIsSubmit(true)
    }

    const onYesClick = () => {
        let medicine = []
        let device = []
        let dis = []
        let error_m = ['Some fields are empty. ']
        let ch = true
        let ch2 = true
        let ch3 = true
        let ch4 = true
        medicineList.forEach(item => {
            if (!(item.medicineID === '' && item.name === '' && item.price === '' 
                && item.amount === '' && item.type === 'used' && item.note === '')) {
                medicine.push(item)
            }
        })
        medicine.forEach(item => {
            if (item.medicineID === '' || item.amount === '') {
                // console.log('cant submit')
                ch = false
            }
        })
        // if (!disease.diseaseName)
        // {
        //     ch4 = false
        //     error_m.push('[Disease] ')
        // }
        if(!ch)
            error_m.push('[Medicine] ')
        deviceList.forEach(item => {
            if (!(item.deviceID === '' && item.name === '' && item.price === '' 
                && item.amount === '' && item.type === 'used' && item.note === '')) {
                device.push(item)
            }
        })
        device.forEach(item => {
            if (item.deviceID === '' || item.amount === '') {
                // console.log('cant submit')
                ch2 = false
            }
        })
        if(!ch2)
            error_m.push('[Device] ')
        if (!summary) {
            ch3 = false
            error_m.push('[Summary] ')
        }
        if(!ch)
            error_m.push('[Medicine] ')
        disease.forEach(item => {
            if (!(item.diseaseID === '' && item.diseaseName === '')) {
                dis.push(item)
            }
        })
        console.log(medicine)
        console.log(device)
        console.log(dis)
        if (ch && ch2 && ch3) {
            console.log('can send')
            let data = {
                "appointmentID": appointmentID,
                "diseaseID": dis,
                "symptom": symptom,
                "summary": summary,
                "medicine": medicine,
                "device": device,
            }
            console.log(data)
            axios.post(`${url}/api/updateAppointment`, data)
                .then(res => {
                    console.log(res)
                    // setRefresh(!refresh)
                })
                .catch(err => {
                    console.log(err)
                })
            toast({
                title: 'Success submit.',
                description: "We've updated your appointment for you.",
                status: 'success',
                duration: 3000,
                isClosable: false,
              })
            setIsSend(true)
            setTimeout(() => {
                router.push('/appointment')
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
              })
            setIsSubmit(false)
            setError(true)
        }
    }

    console.log(data)
    console.log(disease)
    console.log(medicineList)
    console.log(deviceList)

    console.log('path: ' + router.asPath)
    return (
        <div style={{backgroundColor: Colour.AlmostWhite, marginBottom: '80px'}}>
            <Loading isLoading={isLoading}/>
            <Box sx={container} >
                <Heading>
                    Appointment
                </Heading>
                <Box sx={line}></Box>
            </Box>

            <Flex sx={container2}>
                <Flex sx={container3}>
                    <Heading as='h4' size='md'>Appointment ID: {appointmentID}</Heading>
                        <HStack spacing={4}>
                            <FormControl>
                                <FormLabel>First name</FormLabel>
                                <Input 
                                        isDisabled _disabled={{opacity: 0.8}}
                                        value={data[0].patient_firstname}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel>Last name</FormLabel>
                                <Input 
                                        isDisabled _disabled={{opacity: 0.8}}
                                        value={data[0].patient_lastname}
                                />
                            </FormControl>
                        </HStack>

                        <FormControl>
                            <FormLabel>Symptom</FormLabel>
                            <Textarea resize='none' isDisabled _disabled={{opacity: 0.8}}
                                value={symptom}
                            />
                        </FormControl>
                        
                        <Heading as='h4' size='sm'>Disease</Heading>
                        {   props ?
                            disease.map((item, i) => {
                                return (
                                    <FormControl>
                                        <FormLabel>Name</FormLabel>
                                        <HStack>

                                            <AutoComplete openOnFocus>
                                                <AutoCompleteInput variant="outline"
                                                    value={item.diseaseName || ''}
                                                    onChange={(e) => {
                                                        let id = 0
                                                        diseases.forEach(item2 => {
                                                            if (item2.diseaseName === e.target.value) {
                                                                id = item2.DiseaseID
                                                            }
                                                        })
                                                        setDiseaseIn(e.target.value, i, id)
                                                        // let temp = { diseaseID: id, diseaseName: e.target.value }
                                                        // setDisease(temp)
                                                    }}
                                                    isDisabled={isSubmit} _disabled={{opacity: 0.8}}
                                                />
                                                <AutoCompleteList>
                                                    { props ?
                                                        diseases.map((dis, j) => (
                                                            <AutoCompleteItem
                                                                key={j}
                                                                value={dis.diseaseName}
                                                                textTransform="caitalize"
                                                                align="center"
                                                                onClick={() => {
                                                                    // let temp = { diseaseID: dis.DiseaseID, diseaseName: dis.diseaseName }
                                                                    // setDisease(temp)
                                                                    setDiseaseIn(dis.diseaseName, i, dis.DiseaseID)
                                                                }}
                                                            >
                                                                <Text ml="4">{dis.diseaseName}</Text>
                                                            </AutoCompleteItem>
                                                        )) : null 
                                                    }
                                                </AutoCompleteList>
                                            </AutoComplete>
                                            { i !== 0 ?
                                                <IconButton sx={buttonStyle(Colour.Red, Colour.White)} size='sm' icon={<CloseIcon />} 
                                                    onClick={() => del(2, i)}
                                                /> :
                                                <IconButton sx={buttonStyle(Colour.Red, Colour.White)} size='sm' icon={<CloseIcon />} 
                                                    visibility='hidden'
                                                />
                                            }
                                        </HStack>
                                    </FormControl>
                                );
                            }) : null
                        }
                        
                        <Button sx={buttonStyle(Colour.Green, Colour.White)} size='xs' rightIcon={<AddIcon />}
                            isDisabled={isSubmit} _disabled={{opacity: 0.8}}
                            onClick={()=>{setDisease([...disease, 
                                {"diseaseID": "", "diseaseName": ""}])}}
                            w='10%'
                        >
                            Add
                        </Button>

                        <FormControl isRequired>
                            <FormLabel>Summary</FormLabel>
                            <Textarea resize='none' isDisabled={isSubmit} _disabled={{opacity: 0.8}}
                                value={summary} onChange={e => setSummary(e.target.value)}
                                isInvalid={error && !summary}
                            />
                        </FormControl> 

                        <HStack align='flex-start'>
                            <VStack align='flex-start'>
                                <HStack>
                                    <Heading as='h4' size='sm'>Medicine</Heading>
                                    <Button sx={buttonStyle(Colour.Green, Colour.White)} size='xs' rightIcon={<AddIcon />}
                                        isDisabled={isSubmit} _disabled={{opacity: 0.8}}
                                        onClick={()=>{setMedicineList([...medicineList, 
                                            {"medicineID": "", "name": "", "price": "", "amount": "", "type": "used", "note": ""}])}}
                                    >
                                        Add
                                    </Button>
                                </HStack>
                                {
                                    medicineList.map((item, index) => {
                                        return (
                                            <Flex sx={container3} spacing={2} key={index}>
                                                <HStack justify='space-between'>
                                                    <Checkbox onChange={(e) => setCheck(0, e.target.checked, index)}
                                                        isChecked={item.type === 'takehome'}
                                                        isDisabled={isSubmit} _disabled={{opacity: 0.8}}
                                                    >
                                                        Take me home
                                                    </Checkbox>
                                                    { index !== 0 ?
                                                        <Button id={index} sx={buttonStyle(Colour.Red, Colour.White)} 
                                                            size='xs' rightIcon={<SmallCloseIcon />}
                                                            onClick={() => del(0, index)}
                                                            isDisabled={isSubmit} _disabled={{opacity: 0.8}}
                                                        >
                                                            Remove
                                                        </Button> : null
                                                    }
                                                </HStack>
                                                <HStack>
                                                    <AutoComplete openOnFocus>
                                                        <AutoCompleteInput variant="outline"
                                                            value={item.name || ''}
                                                            onChange={(e) => setName(0, e.target.value, index)}
                                                            isDisabled={isSubmit} _disabled={{opacity: 0.8}}
                                                            isInvalid={error && !item.medicineID && item.name}
                                                        />
                                                        <AutoCompleteList>
                                                            { props ?
                                                                medicine.map((med, i) => (
                                                                    <AutoCompleteItem
                                                                        key={i}
                                                                        value={med.medicine_name}
                                                                        textTransform="capitalize"
                                                                        align="center"
                                                                        onClick={() => setName(0, med.medicine_name, index, med.m_amount, med.m_priceperunit, med.medicineID)}
                                                                    >
                                                                        <Text ml="4">{med.medicine_name}</Text>
                                                                    </AutoCompleteItem>
                                                                )) : null 
                                                            }
                                                        </AutoCompleteList>
                                                    </AutoComplete>
                                                    <NumberInput min={1} max={item.m_amount} precision={0} step={1}
                                                        onChange={(e) => setNum(0, e, index)}
                                                        isDisabled={isSubmit || !item.m_amount} _disabled={{opacity: 0.8}}
                                                        isInvalid={error && !item.amount && item.medicineID}
                                                    >
                                                        <NumberInputField placeHolder={isSubmit || !item.m_amount ? 'amount' : item.m_amount} />
                                                        <NumberInputStepper>
                                                            <NumberIncrementStepper />
                                                            <NumberDecrementStepper />
                                                        </NumberInputStepper>
                                                    </NumberInput>
                                                </HStack>
                                                <Input placeholder='Note...' value={item.note}
                                                    onChange={(e) => setNote(0, e.target.value, index)}
                                                    isDisabled={isSubmit} _disabled={{opacity: 0.8}}
                                                />
                                            </Flex>
                                        );
                                    })
                                }                      
                            </VStack>

                            <VStack align='flex-start'>
                                <HStack>
                                    <Heading as='h4' size='sm'>Device</Heading>
                                    <Button sx={buttonStyle(Colour.Green, Colour.White)} size='xs' rightIcon={<AddIcon />}
                                        isDisabled={isSubmit} _disabled={{opacity: 0.8}}
                                        onClick={()=>{setDeviceList([...deviceList, 
                                            {"deviceID": "", "name": "", "price": "", "amount": "", "type": "used", "note": ""}])}}
                                    >
                                        Add
                                    </Button>
                                </HStack>
                                {
                                    deviceList.map((item, index) => {
                                        return (
                                            <Flex sx={container3} spacing={2} key={index}>
                                                <HStack justify='space-between'>
                                                    <Checkbox onChange={(e) => setCheck(1, e.target.checked, index)}
                                                        isChecked={item.type === 'takehome'}
                                                        isDisabled={isSubmit} _disabled={{opacity: 0.8}}
                                                    >
                                                        Take me home
                                                    </Checkbox>
                                                    { index !== 0 ?
                                                        <Button id={index} sx={buttonStyle(Colour.Red, Colour.White)} 
                                                            size='xs' rightIcon={<SmallCloseIcon />}
                                                            onClick={() => del(1, index)}
                                                            isDisabled={isSubmit} _disabled={{opacity: 0.8}}
                                                        >
                                                            Remove
                                                        </Button> : null
                                                    }
                                                </HStack>
                                                <HStack>
                                                    <AutoComplete openOnFocus>
                                                        <AutoCompleteInput variant="outline"
                                                            value={item.name || ''}
                                                            onChange={(e) => setName(1, e.target.value, index)}
                                                            isDisabled={isSubmit} _disabled={{opacity: 0.8}}
                                                            isInvalid={error && !item.deviceID && item.name}
                                                        />
                                                        <AutoCompleteList>
                                                            { props ?
                                                                device.map((dev, i) => (
                                                                    <AutoCompleteItem
                                                                        key={i}
                                                                        value={dev.device_name}
                                                                        textTransform="capitalize"
                                                                        align="center"
                                                                        onClick={() => setName(1, dev.device_name, index, dev.d_amount, dev.d_priceperunit, dev.deviceID)}
                                                                    >
                                                                        <Text ml="4">{dev.device_name}</Text>
                                                                    </AutoCompleteItem>
                                                                )) : null 
                                                            }
                                                        </AutoCompleteList>
                                                    </AutoComplete>
                                                    <NumberInput min={1} max={item.d_amount} precision={0} step={1}
                                                        onChange={(e) => setNum(1, e, index)}
                                                        isDisabled={isSubmit || !item.d_amount} _disabled={{opacity: 0.8}}
                                                        isInvalid={error && !item.amount && item.deviceID}
                                                    >
                                                        <NumberInputField placeHolder={isSubmit || !item.d_amount ? 'amount' : item.d_amount}/>
                                                        <NumberInputStepper>
                                                            <NumberIncrementStepper />
                                                            <NumberDecrementStepper />
                                                        </NumberInputStepper>
                                                    </NumberInput>
                                                </HStack>
                                                <Input placeholder='Note...' value={item.note}
                                                    onChange={(e) => setNote(1, e.target.value, index)}
                                                    isDisabled={isSubmit} _disabled={{opacity: 0.8}}
                                                />
                                            </Flex>
                                        );
                                    })
                                }                      
                            </VStack>                   
                        </HStack>   
                </Flex>

                <HStack justify='end'>
                    { !isSubmit ?
                        <ButtonGroup>
                            <Button sx={buttonStyle(Colour.Green, Colour.White)} 
                                onClick={() => onSummitClick()}
                            >
                                Submit
                            </Button>
                            <Button sx={buttonStyle(Colour.Red, Colour.White)} 
                                onClick={() => router.push('/appointment')}
                            >
                                Cancel
                            </Button>
                        </ButtonGroup> :
                        <>
                            <Text>Submit?</Text>
                            <ButtonGroup>
                                <Button sx={buttonStyle(Colour.Green, Colour.White)} 
                                    onClick={() => onYesClick()} isDisabled={isSend}
                                >
                                    Yes
                                </Button>
                                <Button sx={buttonStyle(Colour.Red, Colour.White)} 
                                    onClick={() => setIsSubmit(false)} isDisabled={isSend}
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

export const getStaticPaths = async () => {
    const res = await axios.get(`${url}/api/getAppointment/path`);
    const paths = res.data.map((item) => ({
        params: {
            appointmentID: item.appointmentID
        }
    }));
    // const paths = [
    //     {
    //         params: {
    //             appointmentID: '1'
    //         }
    //     }
    // ]
    return { paths, fallback: false };
}

export const getStaticProps = async (context)=>{
    const id = context.params.appointmentID;
    const data = await axios.get(`${url}/api/getAppointment/${id}`);
    const diseases = await axios.get(`${url}/api/getDisease`);
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
            data: JSON.parse(JSON.stringify(data.data)),
            diseases: JSON.parse(JSON.stringify(diseases.data)),
            medicine: JSON.parse(JSON.stringify(medicine.data)),
            device: JSON.parse(JSON.stringify(device.data))
            // data: data.data[0],
            // medicine: medicine.data,
            // device: device.data
        }
    }
}
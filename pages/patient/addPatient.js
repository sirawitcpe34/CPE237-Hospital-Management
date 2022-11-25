import {useRouter} from 'next/router'
import {Avatar, Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputLeftElement, 
    InputRightElement, Heading, HStack, Radio, Select, SimpleGrid, Text, Textarea, Stack, RadioGroup,
    useToast } from '@chakra-ui/react'
import phoneFormatter from 'phone-formatter'
import axios from 'axios'
import url from '../../url'


import Colour from '../../Colour'
import { useState,useEffect } from 'react'
import { emptyQuery } from 'pg-protocol/dist/messages'

export default ()=>{
    const router = useRouter()
    const toast = useToast()

    const [file, setFile] = useState(['Profile name', null])
    const [isSend, setIsSend] = useState(false)
    const [allergyForm, setAllergyForm] = useState(true)
    const [error, setError] = useState(false)
    const [form, setForm] = useState(
        { firstname: "", lastname: "", gender: "", dob: "", citizenID: "",
        phone: "", address: "", insurance: "", EC_name: "", EC_relationship: "",
        EC_phone: "", blood: "", allergy: "", med_history: "", profile_img: "",
    })
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
        if (sessionStorage.getItem('positionID') != 3)
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
        bgColor: 'white',
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
        bg: Colour.LightGrey, 
        px: 4, 
        h: 8,
        _hover: {filter: 'brightness(0.9)'},
        transition:'all 0.2s cubic-bezier(.08,.52,.52,1)',
    }

    let summitButton = {
        bg: Colour.Green,
        color: 'white',
        _hover: {filter: 'brightness(0.9)'},
        transition:'all 0.2s cubic-bezier(.08,.52,.52,1)',
        width: '100px',
    }

    const checkCitizen = (e) => {
        let regExp = /^[0-9]+$/g
        let result = regExp.test(e.target.value)
        let id = e.target.value
        console.log('citizen' + result)

        if (result && id.length === 13)
        {
            let check = parseInt(id[0]) * 13 + parseInt(id[1]) * 12 + parseInt(id[2]) * 11 + 
                        parseInt(id[3]) * 10 + parseInt(id[4]) * 9 + parseInt(id[5]) * 8 + 
                        parseInt(id[6]) * 7 + parseInt(id[7]) * 6 + parseInt(id[8]) * 5 + 
                        parseInt(id[9]) * 4 + parseInt(id[10]) * 3 + parseInt(id[11]) * 2
            let checkDigit = check % 11
            if (11 - checkDigit === parseInt(id[12])) // Correct 13
            {   
                setForm({...form, citizenID: id})
            }
            else // Incorrect 13
            {
                setForm({...form, citizenID: ""}) 
            }
        }
        else // Incorrect + Wrong format
        {
            setForm({...form, citizenID: ""}) 
        }
    }

    const checkECPhone = (e) => {
        let regExp = /^[0-9]+$/g
        let result = regExp.test(e.target.value)
        let phone = e.target.value

        if (result)
        {
            setForm({...form, EC_phone: phone})
        }
        else
        {
            setForm({...form, EC_phone: ""}) 
        }
    }

    const checkPhone = (e) => {
        let regExp = /^[0-9]+$/g
        let result = regExp.test(e.target.value)
        let phone = e.target.value
        console.log(result)

        if (result)
        {
            setForm({...form, phone: phone})
        }
        else
        {
            setForm({...form, phone: ""}) 
        }
    }

    const handleAllergyForm = (e) => {
        console.log(e)
        if (e === 'y')
            setAllergyForm(false)
        else
        {
            setForm({...form, allergy: ""})
            setAllergyForm(true)
        }
    }

    const handleFile = (e) => {
        if (e.target.files[0]) {
            setFile([e.target.files[0].name, e.target.files[0]])
        }
    }

    const onSummitClick = () => {
        console.log('summit clicked!')
        if (form.firstname && form.lastname && form.gender && form.dob &&
            form.citizenID && form.phone && form.address && form.EC_name &&
            form.EC_relationship && form.EC_phone && form.blood)
        {
            axios.post(`${url}/api/addPatient`, form, {headers: {
                staffid: sessionStorage.getItem("staffID")
            }})
                .then(res => {
                    console.log(res)
                    // setRefresh(!refresh)
                })
                .catch(err => {
                    console.log(err)
                })
            setError(false)
            setIsSend(true)
            toast({
                title: 'Success submit.',
                description: "We've added your patient for you.",
                status: 'success',
                duration: 3000,
                isClosable: false,
                
              })
            setTimeout(() => {
                router.push('/patient')
            }, 3000)
            console.log('form is valid')
        }
        else
        {
            setError(true)
            toast({
                title: 'Error submit.',
                description: 'Some fields are empty.',
                status: 'error',
                duration: 3000,
                isClosable: false,
                containerStyle: {
                    maxWidth: '700px',
                  },
              })
            console.log('form is not valid')
        }
    }
    console.log(form)
    return (
        <div style={{backgroundColor: Colour.AlmostWhite, marginBottom: '80px'}}>
            <Box sx={container} >
                <Heading>
                    Add Patient
                </Heading>
                <Box sx={line}></Box>
            </Box>

            <Flex sx={container2}>
                <Flex sx={container3}>
                    <Heading as='h4' size='md'>Personal information</Heading>
                
                    <Avatar size='2xl' src={form.profile_img} />

                    <HStack>
                        <Text minW='160px' overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'>
                            Profile image link
                        </Text>
                        <FormControl>
                            <FormLabel display='flex'>
                                <Input value={form.profile_img} w='500px'
                                    onChange={(e)=>{setForm({...form, profile_img: e.target.value})}}
                                />
                            </FormLabel>
                        </FormControl>
                    </HStack>

                    <Box>
                        <SimpleGrid columns={2} spacing={4}>
                            <FormControl isRequired isInvalid={error && !form.firstname}>
                                <FormLabel htmlFor='first-name'>First name</FormLabel>
                                <Input id='first-name' value={form.firstname}
                                    onChange={(e)=>{setForm({...form, firstname: e.target.value})}}
                                />
                                {/* <FormErrorMessage>First name is required.</FormErrorMessage> */}
                            </FormControl>
                            <FormControl isRequired isInvalid={error && !form.lastname}>
                                <FormLabel htmlFor='last-name'>Last name</FormLabel>
                                <Input id='last-name'  value={form.lastname}
                                    onChange={(e)=>{setForm({...form, lastname: e.target.value})}}
                                />
                            </FormControl>
                            <FormControl isRequired isInvalid={error && !form.gender}>
                                <FormLabel htmlFor='gender'>Gender</FormLabel>
                                <Select id='gender' placeholder='Select gender'
                                    onChange={(e)=>{setForm({...form, gender: e.target.value})}}
                                >
                                    <option value='Male'>Male</option>
                                    <option value='Female'>Female</option>
                                    <option value='Other'>Other</option>
                                </Select>
                            </FormControl>
                            <FormControl isRequired isInvalid={error && !form.dob}>
                                <FormLabel htmlFor='birth-date'>Birth date</FormLabel>
                                <Input id='birth-date' type='date'
                                    onChange={(e)=>{setForm({...form, dob: e.target.value.replace('T', ' ')})}}
                                />
                            </FormControl>
                            <FormControl isRequired isInvalid={error && !form.citizenID}>
                                <FormLabel htmlFor='citizen-id'>Citizen ID</FormLabel>
                                <Input id='citizen-id' maxLength={13}
                                    onChange={(e) => checkCitizen(e)}
                                />
                                <FormErrorMessage>Wrong format [13-digit number]</FormErrorMessage>
                            </FormControl>
                            <FormControl isRequired isInvalid={error && !form.phone}>
                                <FormLabel htmlFor='phone'>Phone number</FormLabel>
                                <Input id='phone'
                                    onChange={(e)=> checkPhone(e)}
                                />
                                <FormErrorMessage>Wrong format [digit number]</FormErrorMessage>
                            </FormControl>
                            <FormControl isRequired isInvalid={error && !form.address}>
                                <FormLabel htmlFor='address'>Address</FormLabel>
                                <Input id='address' value={form.address}
                                    onChange={(e)=>{setForm({...form, address: e.target.value})}}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor='insurance'>Insurance</FormLabel>
                                <Input id='insurance' value={form.insurance}
                                    onChange={(e)=>{setForm({...form, insurance: e.target.value})}}
                                />
                            </FormControl>
                        </SimpleGrid>
                    </Box>
                </Flex>

                <Flex sx={container3}>
                    <Heading as='h4' size='md'>Emergency contact</Heading>
                    <Box>
                        <HStack spacing={4}>
                            <FormControl isRequired isInvalid={error && !form.EC_name} w='50%'>
                                <FormLabel htmlFor='ec-name'>Name</FormLabel>
                                <Input id='ec-name' value={form.EC_name}
                                    onChange={(e)=>{setForm({...form, EC_name: e.target.value})}}
                                />
                            </FormControl>
                            <FormControl isRequired isInvalid={error && !form.EC_relationship} w='20%'>
                                <FormLabel htmlFor='ec-relationship'>Relationship</FormLabel>
                                <Input id='ec-relationship' value={form.EC_relationship}
                                    onChange={(e)=>{setForm({...form, EC_relationship: e.target.value})}}
                                />
                            </FormControl>
                            <FormControl isRequired isInvalid={error && !form.EC_phone} w='30%'>
                                <FormLabel htmlFor='ec-phone'>Phone number</FormLabel>
                                <Input id='ec-phone'
                                    onChange={(e)=> checkECPhone(e)}
                                />
                                <FormErrorMessage>Wrong format [digit number]</FormErrorMessage>

                            </FormControl>
                        </HStack>
                    </Box>  
                </Flex>

                <Flex sx={container3}>
                    <Heading as='h4' size='md'>Medical information</Heading>
                    <HStack spacing={8}>
                        <FormControl w='296px' isRequired isInvalid={error && !form.blood}>
                            <FormLabel htmlFor='blood'>Blood</FormLabel>
                            <Select id='blood' placeholder='Select blood type'
                                onChange={(e)=>{setForm({...form, blood: e.target.value})}}
                            >
                                    <option>O</option>
                                    <option>A</option>
                                    <option>B</option>
                                    <option>AB</option>
                                </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor='allergy'>Allergy</FormLabel>
                            <RadioGroup defaultValue='n' onChange={(e) => handleAllergyForm(e)}>
                                <HStack id='allergy'>
                                    <Radio value='n'>No</Radio>
                                    <Radio value='y'>Yes</Radio>
                                    <Input id='allergy' value={form.allergy} isDisabled={allergyForm}
                                        onChange={(e)=>{setForm({...form, allergy: e.target.value})}}
                                    />
                                </HStack>
                            </RadioGroup>
                        </FormControl>
                    </HStack>
                    <Box>
                        <FormLabel htmlFor='medical-history'>Medical history</FormLabel>
                        <Textarea
                            size='sm'
                            resize='none'
                            value={form.med_history}
                            onChange={(e)=>{setForm({...form, med_history: e.target.value})}}
                        />
                    </Box>
                </Flex>
                <HStack justify='end'>
                    <Button sx={summitButton} onClick={() => onSummitClick()}
                        isDisabled={isSend}
                    >
                        Submit
                    </Button>
                </HStack>
            </Flex>
        </div>
    )
}
import { useRouter } from "next/router";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Heading,
  HStack,
  Radio,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  Stack,
  RadioGroup,
  VStack,
  useToast,
  Avatar
} from "@chakra-ui/react";

import { ChevronDownIcon } from "@chakra-ui/icons";
import axios from "axios";
import Colour from "../../Colour";
import { useState, useEffect } from "react";
import emailValidate from "email-validator";
import phoneFormatter from "phone-formatter";
import url from "../../url";

export default (props) => {
  const router = useRouter();
  const toast = useToast();
  const [positionID, setPositionID] = useState(null);

  useEffect(() => {
    const kickOut = () => {
      sessionStorage.clear();
      router.push("/");
      alert("please login again");
    };
    setPositionID(sessionStorage.getItem("positionID"));
    if (sessionStorage.getItem("positionID") != 3) {
      kickOut();
    }
  }, []);
  console.log(props);

  let container = {
    width: "100vw",
    paddingLeft: "360px",
    marginTop: "64px",
    bgColor: Colour.AlmostWhite,
  };

  let container2 = {
    flexDirection: "column",
    gap: "4",
    maxWidth: "container.lg",
    width: "100%",
    marginLeft: "360px",
    marginTop: "32px",
  };

  let container3 = {
    border: "1px solid",
    borderColor: Colour.LightGrey,
    borderRadius: "12px",
    flexDirection: "column",
    gap: "4",
    width: "100%",
    padding: "16px",
    bgColor: "white",
  };

  let line = {
    width: "90%",
    marginRight: "4000px",
    paddingLeft: "360px",
    bgColor: "#000",
    marginTop: " 12px",
    height: "2px",
    bgColor: Colour.LightGrey,
  };

  let fileButton = {
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    borderRadius: "md",
    bg: Colour.LightGrey,
    px: 4,
    h: 8,
    _hover: { filter: "brightness(0.9)" },
    transition: "all 0.2s cubic-bezier(.08,.52,.52,1)",
  };

  let summitButton = {
    bg: Colour.Green,
    color: "white",
    _hover: { filter: "brightness(0.9)" },
    transition: "all 0.2s cubic-bezier(.08,.52,.52,1)",
    width: "100px",
  };

  const [file, setFile] = useState(["Profile Image", null]);
  const [allergyForm, setAllergyForm] = useState(true);
  const [error, setError] = useState(false);
  const [form, setForm] = useState({});

  const checkCitizen = (e) => {
    let regExp = /[0-9]/g;
    let result = regExp.test(e.target.value);
    let id = e.target.value;
    if (result && id.length === 13) {
      let check =
        parseInt(id[0]) * 13 +
        parseInt(id[1]) * 12 +
        parseInt(id[2]) * 11 +
        parseInt(id[3]) * 10 +
        parseInt(id[4]) * 9 +
        parseInt(id[5]) * 8 +
        parseInt(id[6]) * 7 +
        parseInt(id[7]) * 6 +
        parseInt(id[8]) * 5 +
        parseInt(id[9]) * 4 +
        parseInt(id[10]) * 3 +
        parseInt(id[11]) * 2;
      let checkDigit = check % 11;
      if (11 - checkDigit === parseInt(id[12])) {
        setForm({ ...form, citizenID: id });
      } else {
        setForm({ ...form, citizenID: "" });
      }
    } else {
      setForm({ ...form, citizenID: "" });
    }
  };

  const checkECPhone = (e) => {
    let regExp = /[0-9]/g;
    let result = regExp.test(e.target.value);
    let phone = e.target.value;
    if (result) {
      setForm({ ...form, EC_phone: phone });
    } else {
      setForm({ ...form, EC_phone: "" });
    }
  };

  const checkPhone = (e) => {
    let regExp = /[0-9]/g;
    let result = regExp.test(e.target.value);
    let phone = e.target.value;
    if (result) {
      setForm({ ...form, phone_number: phone });
    } else {
      setForm({ ...form, phone_number: "" });
    }
  };

  const checkEmail = (e) => {
    if (emailValidate.validate(e.target.value)) {
      setForm({ ...form, email: e.target.value });
    } else {
      setForm({ ...form, email: "" });
    }
  };

  const handleAllergyForm = (e) => {
    console.log(e);
    if (e === "y") setAllergyForm(false);
    else {
      setForm({ ...form, allergy: "" });
      setAllergyForm(true);
    }
  };

  const handleFile = (e) => {
    if (e.target.files[0]) {
      setFile([e.target.files[0].name, e.target.files[0]]);
    }
  };

  // const onSummitClick = () =>
  // {
  //     console.log('summit clicked!')
  //     if (form.firstname && form.lastname && form.citizenID && form.birthDate &&
  //         form.phone_number && form.email && form.department && form.position &&
  //         form.licensed_number && form.username && form.password && form.confirm_password && form.profile_img)
  //     {
  //         setError(false)
  //         console.log('form is valid')
  //     }
  //     else
  //     {
  //         setError(true)
  //         console.log('form is not valid')
  //     }
  // }

  const onSubmitClick = async () => {
    console.log(sessionStorage.getItem("staffID"));
    if (
      form.firstname &&
      form.lastname &&
      form.citizenID &&
      form.birthDate &&
      form.phone_number &&
      form.email &&
      form.department &&
      form.position &&
      form.licensed_number &&
      form.salary &&
      form.username &&
      form.password &&
      form.confirm_password
    ) {
      setError(false);
      console.log("form is valid");
      console.log({
        firstname: form.firstname,
        lastname: form.lastname,
        dob: form.birthDate,
        citizenID: form.citizenID,
        licensed_number: form.licensed_number,
        phone_number: form.phone_number,
        salary: form.salary,
        username: form.username,
        password: form.password,
        email: form.email,
        departmentID: form.department,
        positionID: form.position,
        profile_img: form.profile_img,
    })
      axios
        .post(
          `${url}/api/addStaff`,
          {
              firstname: form.firstname,
              lastname: form.lastname,
              dob: form.birthDate,
              citizenID: form.citizenID,
              licensed_number: form.licensed_number,
              phone_number: form.phone_number,
              salary: form.salary,
              username: form.username,
              password: form.password,
              email: form.email,
              departmentID: form.department,
              positionID: form.position,
              profile_img: form.profile_img,
          },
          {
            headers: {
              staffid: sessionStorage.getItem("staffID"),
            },
          }
        )
        .then((response) => {
          console.log(response.data);
        })
        .catch((err) => console.log(err));
      
        toast({
        title: "Success submit.",
        description: "The staff has been added.",
        status: "success",
        duration: 3000,
        isClosable: false,
      });
      setTimeout(() => {
        router.push('/doctor')
    }, 3000)
    // window.location.reload();
    //   setTimeout(function(){
    //       window.location.reload(1);
    //    }, 4000);
    } else {
      setError(true);
      console.log("form is not valid");
      toast({
        title: "Error submit.",
        description: "Please fill the required fields.",
        status: "error",
        duration: 3000,
        isClosable: false,
      });
    }
  };

  console.log(form);
  return (
    <div style={{ backgroundColor: Colour.AlmostWhite, marginBottom: "80px" }}>
      <Box sx={container}>
        <Heading>Add Doctor</Heading>
        <Box sx={line}></Box>
      </Box>

      <Flex sx={container2}>
        <Flex sx={container3}>
          <Heading as="h4" size="md">
            Personal information
          </Heading>
          <Avatar size='2xl' src={form.profile_img} />

          <HStack>
            {/* <Text maxW='400px' overflow='hidden' whiteSpace='nowrap' textOverflow='ellipsis'>
                            {file[0]}
                        </Text>
                        <FormLabel display='flex'>

                        </FormLabel>
                            <Input id='first-name' value={form.profile_img}
                                onChange={(e) => { setForm({ ...form, profile_img: e.target.value }) }}
                            /> */}
            <FormControl>
              <FormLabel htmlFor="profile_img">Profile image</FormLabel>
              <Input
                id="profile_img"
                value={form.profile_img}
                w="50%"
                onChange={(e) => {
                  setForm({ ...form, profile_img: e.target.value });
                }}
                placeholder="Insert profile image link"
              />
            </FormControl>
          </HStack>

          <Box>
            <SimpleGrid columns={2} spacing={3}>
              <FormControl isRequired isInvalid={error && !form.firstname}>
                <FormLabel htmlFor="first-name">First Name</FormLabel>
                <Input
                  id="first-name"
                  value={form.firstname}
                  onChange={(e) => {
                    setForm({ ...form, firstname: e.target.value });
                  }}
                />
                {/* <FormErrorMessage>First name is required.</FormErrorMessage> */}
              </FormControl>
              <FormControl isRequired isInvalid={error && !form.lastname}>
                <FormLabel htmlFor="last-name">Last Name</FormLabel>
                <Input
                  id="last-name"
                  value={form.lastname}
                  onChange={(e) => {
                    setForm({ ...form, lastname: e.target.value });
                  }}
                />
              </FormControl>
              <FormControl isRequired isInvalid={error && !form.citizenID}>
                <FormLabel htmlFor="citizen">Citizen ID</FormLabel>
                <Input
                  id="citizen"
                  value={form.citizenID}
                  onChange={(e) => {
                    setForm({ ...form, citizenID: e.target.value });
                  }}
                />
              </FormControl>
              <FormControl isRequired isInvalid={error && !form.birthDate}>
                <FormLabel htmlFor="birth-date">Birth Date</FormLabel>
                <Input
                  id="birth-date"
                  type="date"
                  onChange={(e) => {
                    setForm({
                      ...form,
                      birthDate: e.target.value.replace("T", " "),
                    });
                  }}
                />
              </FormControl>
              <FormControl isRequired isInvalid={error && !form.phone_number}>
                <FormLabel htmlFor="phone">Phone number</FormLabel>
                <Input
                  id="phone"
                  maxLength={10}
                  onChange={(e) => checkPhone(e)}
                />
              </FormControl>
              <FormControl isRequired isInvalid={error && !form.email}>
                <FormLabel htmlFor="email">Email Address</FormLabel>
                <Input id="email" onChange={(e) => checkEmail(e)} />
              </FormControl>
            </SimpleGrid>
          </Box>
        </Flex>

        <Flex sx={container3}>
          <Heading as="h4" size="md">
            Staff Information
          </Heading>
          <Box>
            <VStack spacing={4}>
              <HStack spacing={4} w="100%">
                <FormControl
                  isRequired
                  isInvalid={error && !form.department}
                  w="50%"
                >
                  <FormLabel htmlFor="ec-name">Department</FormLabel>
                  <Select
                    icon={<ChevronDownIcon />}
                    placeholder="Select Department"
                    bgColor={Colour.White}
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                  >
                    {props.department.map((department, index) => (
                      <option
                        key={department.departmentID}
                        value={department.departmentID}
                      >
                        {department.department_name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={error && !form.position}
                  w="50%"
                >
                  <FormLabel htmlFor="ec-relationship">Position</FormLabel>

                  <Select
                    icon={<ChevronDownIcon />}
                    placeholder="Select Position"
                    bgColor={Colour.White}
                    onChange={(e) =>
                      setForm({ ...form, position: e.target.value })
                    }
                  >
                    {props.position.map((position, index) => (
                      <option
                        key={position.position_name}
                        value={position.positionID}
                      >
                        {position.position_name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>
              <HStack spacing={4} w="100%">
                <FormControl
                  isRequired
                  isInvalid={error && !form.licensed_number}
                  w="50%"
                >
                  <FormLabel htmlFor="licensed_number">
                    Licensed Number
                  </FormLabel>
                  <Input
                    type="number"
                    id="licensed_number"
                    value={form.licensed_number}
                    onChange={(e) => {
                      setForm({ ...form, licensed_number: e.target.value });
                    }}
                  />
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={error && !form.salary}
                  w="50%"
                >
                  <FormLabel htmlFor="salary">Salary</FormLabel>
                  <Input
                    type="number"
                    id="salary"
                    value={form.salary}
                    onChange={(e) => {
                      setForm({ ...form, salary: e.target.value });
                    }}
                  />
                </FormControl>
              </HStack>
            </VStack>
          </Box>
        </Flex>

        <Flex sx={container3}>
          <Heading as="h4" size="md">
            Authentical information
          </Heading>
          <HStack spacing={4}>
            <FormControl
              isRequired
              isInvalid={error && !form.username}
              w="33.33%"
            >
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input
                id="username"
                value={form.username}
                onChange={(e) => {
                  setForm({ ...form, username: e.target.value });
                }}
              />
            </FormControl>
            <FormControl
              isRequired
              isInvalid={error && !form.password}
              w="33.33%"
            >
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                type="password"
                id="password"
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                }}
              />
            </FormControl>
            <FormControl
              isRequired
              isInvalid={error && !form.confirm_password}
              w="33.33%"
            >
              <FormLabel htmlFor="confirm_password">Confirm Password</FormLabel>
              <Input
                type="password"
                id="confirm_password"
                value={form.confirm_password}
                onChange={(e) => {
                  setForm({ ...form, confirm_password: e.target.value });
                }}
              />
            </FormControl>
          </HStack>
        </Flex>
        <HStack justify="end">
          <Button sx={summitButton} onClick={() => onSubmitClick()}>
            Submit
          </Button>
        </HStack>
      </Flex>
    </div>
  );
};

export const getStaticProps = async (context) => {
  const department = await axios.get(`${url}/api/getDepartment`);
  const position = await axios.get(`${url}/api/getPosition`);
  return {
    props: {
      department: department.data,
      position: position.data,
    },
    revalidate: 60,
  };
};

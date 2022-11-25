import {
  Button,
  Box,
  VStack,
  Input,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  Select,
  useToast,
} from "@chakra-ui/react";
import { React, useEffect, useState } from "react";
import Colour from "../Colour";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import axios from "axios";
import url from "../url";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { set } from "date-fns";
import Loading from "./loading";

export default (props) => {
  const router = useRouter();
  const toast = useToast();
  const { isOpen, onClose, patientID } = props;
  console.log(props);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const [availableRoom, setAvailableRoom] = useState([]);
  const [availbleDoctor, setAvailableDoctor] = useState([]);
  const [start_date, setstart_date] = useState(new Date());
  const [end_date, setend_date] = useState(new Date());
  const [room, setRoom] = useState("");
  const [doctor, setDoctor] = useState("");
  const [department, setDepartment] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [note, setNote] = useState("");

  let line = {
    width: "100%",
    bgColor: "#000",
    marginTop: " 12px",
    marginRight: "12px",
    height: "2px",
    bgColor: Colour.LightGrey,
  };

  const onSubmitClick = async () => {
    console.log(sessionStorage.getItem("staffID"));
    if (start_date && end_date && department && doctor && room && symptoms) {
      setError(false);
      // console.log(availableRoom[room].price);
      setIsLoading(true);
      axios
        .post(
          `${url}/api/addAppointment`,
          {
            start_date: start_date,
            end_date: end_date,
            patientID: patientID,
            staffID: doctor,
            roomID: availableRoom[room].roomID,
            symptoms: symptoms,
            note: note,
            unit: 1,
            price: availableRoom[room].price,
          },
          {
            headers: {
              staffid: sessionStorage.getItem("staffID"),
            },
          }
        )
      
      setIsLoading(false);
      toast({
        title: "Success submit.",
        description: "Appointment's already added.",
        status: "success",
        duration: 3000,
        isClosable: false,
      });
      setIsSubmit(true);
      onClose();
      setSymptoms("");
      setNote("");
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
      setIsSubmit(false);
    }
  };

  useEffect(() => {
    console.log(selectedDepartment);
  }, [selectedDepartment]);

  const fetchDoctors = async () => {
    console.log("fetchdoctor");
    let result = await axios.get(`${url}/api/getAvailableDoctor`, {
      headers: {
        start_date: new Date(start_date).toISOString(),
        end_date: new Date(end_date).toISOString(),
        departmentid: selectedDepartment,
      },
    });
    console.log(result.data);
    setAvailableDoctor(result.data);
  };

  useEffect(() => {
    console.log(selectedDepartment);
  }, [selectedDepartment]);

  const fetchRooms = async () => {
    let result = await axios.get(`${url}/api/getAvailableRoom`, {
      headers: {
        start_date: new Date(start_date).toISOString(),
        end_date: new Date(end_date).toISOString(),
      },
    });
    setAvailableRoom(result.data);
  };

  useEffect(() => {
    const fetchDepartment = async () => {
      let department = await axios.get(`${url}/api/getDepartment`);
      setDepartment(department.data);
      console.log(department.data);
    };
    fetchDepartment();
  }, []);
  useEffect(() => {
    if (start_date && end_date) {
      fetchRooms();
    }
    if (start_date && end_date && selectedDepartment) {
      fetchDoctors();
    }
  }, [start_date, end_date, selectedDepartment]);

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <Loading isLoading={isLoading} />
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Add appointment
          <Box sx={line}></Box>
        </ModalHeader>
        {/* <ModalCloseButton /> */}
        <ModalBody mb="16px">
          <VStack>
            <FormControl isRequired isInvalid={error && !start_date}>
              <FormLabel>Start time</FormLabel>
              <Datetime
                // displayTimeZone='Asia/Bangkok'
                value={start_date}
                onChange={(value) => {
                  console.log("start_date", new Date(value).toISOString());
                  setstart_date(value);
                }}
              />
            </FormControl>
            <FormControl isRequired isInvalid={error && !end_date}>
              <FormLabel>End time</FormLabel>
              <Datetime
                // displayTimeZone='Asia/Bangkok'
                value={end_date}
                onChange={(value) => {
                  console.log("end_date", value);
                  setend_date(value);
                }}
              />
            </FormControl>

            <FormControl isRequired isInvalid={error && !room}>
              <FormLabel>Department</FormLabel>

              <Select
                icon={<ChevronDownIcon />}
                placeholder="Select Department"
                bgColor={Colour.White}
                onChange={(e) => setSelectedDepartment(e.target.value)}
              >
                {department.map((d) => (
                  <option key={d.departmentID} value={d.departmentID}>
                    {d.department_name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired isInvalid={error && !doctor}>
              <FormLabel>Doctor</FormLabel>
              <Select
                icon={<ChevronDownIcon />}
                placeholder="Select Doctor"
                bgColor={Colour.White}
                onChange={(e) => setDoctor(e.target.value)}
              >
                {availbleDoctor.map((doctors) => (
                  <option key={doctors.staffID} value={doctors.staffID}>
                    {doctors.firstname} {doctors.lastname}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired isInvalid={error && !room}>
              <FormLabel>Room</FormLabel>

              <Select
                icon={<ChevronDownIcon />}
                placeholder="Select Room"
                bgColor={Colour.White}
                onChange={(e) => setRoom(e.target.value)}
              >
                {availableRoom.map((room, index) => (
                  <option key={room.roomID} value={index}>
                    {room.roomName}
                  </option>
                ))}
                {/* {console.log(availableRoom[room].price)} */}
              </Select>
            </FormControl>
            <FormControl isRequired isInvalid={error && !symptoms}>
              <FormLabel>Symptom</FormLabel>
              <Textarea
                resize="none"
                value={symptoms}
                onChange={(e) => {
                  setSymptoms(e.target.value);
                }}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Note</FormLabel>
              <Textarea
                resize="none"
                value={note}
                onChange={(e) => {
                  setNote(e.target.value);
                }}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter gap={4}>
          <Button colorScheme="teal" onClick={() => onSubmitClick()}>
            Submit
          </Button>
          <Button
            colorScheme="red"
            onClick={() => {
              onClose();
              setIsSubmit(false);
              setSymptoms("");
              setNote("");
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

import {
  Button,
  Box,
  Flex,
  Stack,
  HStack,
  VStack,
  Input,
  Text,
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
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import Colour from "../Colour";

export default (props) => {
  const { item, isEdit, isOpen, onClose } = props;
  const [form, setForm] = useState({
    date: item.start_time.split("T")[0],
    time: item.start_time.split("T")[1].replace("Z", ""),
    department: "TEST",
    doctor: item.staffID,
    symptoms: item.symptoms,
    note: item.note,
  });

  let line = {
    width: "100%",
    bgColor: "#000",
    marginTop: " 12px",
    marginRight: "12px",
    height: "2px",
    bgColor: Colour.LightGrey,
  };

  // useEffect(()=>{
  //     console.log(props)
  // },[])

  const onSubmitClick = () => {
    console.log("submit clicked!");
    if (
      form.start_time &&
      form.end_time &&
      form.doctor &&
      form.room &&
      form.symptoms
    ) {
      setError(false);
      console.log("form is valid");
    } else {
      setError(true);
      console.log("form is not valid");
    }
  };

  console.log(form);
  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Appointment ID: {item.appointmentID}
          <Box sx={line}></Box>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody mb="16px">
          <VStack>
            <FormControl isRequired /* isInvalid={error && !form.lastname}*/>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => {
                  setForm({ ...form, date: e.target.value });
                }}
              />
            </FormControl>
            <FormControl isRequired /* isInvalid={error && !form.lastname}*/>
              <FormLabel>Department</FormLabel>
              <Input
                value={form.department}
                // onChange={(e)=>{setForm({...form, department: e.target.value})}}
              />
            </FormControl>
            <FormControl isRequired /* isInvalid={error && !form.lastname}*/>
              <FormLabel>Symptom</FormLabel>
              <Textarea
                resize="none"
                value={form.symptoms}
                // onChange={(e)=>{setForm({...form, lastname: e.target.value})}}
              />
            </FormControl>
            <FormControl isRequired /* isInvalid={error && !form.lastname}*/>
              <FormLabel>Time</FormLabel>
              <Input
                type="time"
                value={form.time}
                // onChange={(e)=>{setForm({...form, lastname: e.target.value})}}
              />
            </FormControl>
            <FormControl isRequired /* isInvalid={error && !form.lastname}*/>
              <FormLabel>Doctor</FormLabel>
              <Input
                value={form.doctor}
                // onChange={(e)=>{setForm({...form, lastname: e.target.value})}}
              />
            </FormControl>
            <FormControl isRequired /* isInvalid={error && !form.lastname}*/>
              <FormLabel>Note</FormLabel>
              <Textarea
                resize="none"
                value={form.note}
                // onChange={(e)=>{setForm({...form, lastname: e.target.value})}}
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter gap={4}>
          <Button colorScheme='teal' onClick={onClose}>Submit</Button>
          <Button
          colorScheme='red'
            onClick={() => {
              onClose();
              setForm({
                date: item.start_time.split("T")[0],
                time: item.start_time.split("T")[1].replace("Z", ""),
                department: "TEST",
                doctor: item.staffID,
                symptoms: item.symptoms,
                note: item.note,
              });
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

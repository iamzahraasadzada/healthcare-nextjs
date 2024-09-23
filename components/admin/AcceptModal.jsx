"use client";
import styles from "./AcceptModal.module.css";
import { IoClose } from "react-icons/io5";
import { store } from "@/Store";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDoctor,
  getDoctor,
  sendSMSNotification,
  updateDoctor,
} from "@/lib/actions/doctorActions";
import { getPatinets } from "@/lib/actions/createUser";
import { convertDate } from "@/lib/utils";

function AcceptModal({ setOpen, data }) {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState("");
  const { data: doctorData } = useQuery({
    queryKey: ["doctor_data"],
    queryFn: getDoctor,
  });

  const { data: patient } = useQuery({
    queryKey: ["patinet_data"],
    queryFn: getPatinets,
  });

  const { setOpenModal, changeStatus } = store((state) => ({
    setOpenModal: state.setOpenModal,
    changeStatus: state.changeStatus,
  }));

  const userIda = patient?.documents.filter((p) => p.$id === data?.patientId);

  const { mutate: mutateCreateDoctor } = useMutation({
    mutationFn: createDoctor,
    onSuccess: () => {
      setOpen(false);
      setOpenModal(false);
      changeStatus(data.$id, "Scheduled");
      queryClient.invalidateQueries("doctor_data");
    },
  });

  const { mutate: mutateUpdateDoctor } = useMutation({
    mutationFn: updateDoctor,
    onSuccess: () => {
      setOpen(false);
      setOpenModal(false);
      changeStatus(data.$id, "Scheduled");
      queryClient.invalidateQueries("doctor_data");
    },
    onError: (error) => {
      console.error("Error during update:", error);
    },
  });

  const { mutate: mutateSendSMS } = useMutation({
    mutationFn: sendSMSNotification,
    onError: (error) => {
      console.error("Error during update:", error);
    },
  });

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  function handleClose() {
    setOpen(false);
    setOpenModal(false);
  }

  function handleClick() {
    const isChanged = doctorData?.documents.filter((d) => {
      const appointment = JSON.parse(d.appointmentId);
      return appointment.patientId === data.patientId;
    });
    if (isChanged?.length > 0) {
      const id = isChanged[0]?.$id;
      mutateUpdateDoctor([
        {
          status: "Scheduled",
          appointmentId: JSON.stringify(data),
          date: selectedDate,
        },
        id,
      ]);
    } else {
      mutateCreateDoctor({
        status: "Scheduled",
        appointmentId: JSON.stringify(data),
        date: selectedDate,
      });
    }

    mutateSendSMS({
      content: `Hi it's CarePulse. Your appointment has been scheduled for ${convertDate(
        selectedDate
      )} with Dr. ${data?.doctor}`,
      userId: userIda[0].userId,
    });
  }

  return (
    <div className={styles.passkey_modal__container}>
      <div className={styles.overlay} />
      <div className={styles.container}>
        <div className={styles.passkey_modal}>
          <div className={styles.row}>
            <div className={styles.col2}>
              <h2>Schedule Appointment </h2>
              <IoClose
                className={styles.close_button}
                onClick={() => handleClose()}
              />
            </div>

            <div className={`${styles.col} ${styles.reason}`}>
              <p>Reason</p>
              <span>{data?.reason}</span>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              <p>Please fill in the following details to schedule</p>
            </div>
            <div className={styles.col}>
              <p>Date</p>
            </div>
            <div className={styles.col}>
              <input
                value={selectedDate}
                onChange={handleDateChange}
                type="date"
                name="date"
                id="date"
              />
            </div>
          </div>
          <button
            onClick={() => handleClick()}
            type="submit"
            className={styles.accept_button}
          >
            Schedule appointment
          </button>
        </div>
      </div>
    </div>
  );
}

export default AcceptModal;

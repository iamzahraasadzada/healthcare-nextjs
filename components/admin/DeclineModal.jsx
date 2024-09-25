"use client";
import { useState } from "react";
import styles from "./DeclineModal.module.css";
import { IoClose } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDoctor,
  getDoctor,
  sendSMSNotification,
  updateDoctor,
} from "@/lib/actions/doctorActions";
import { store } from "@/Store";
import { getPatinets, getUsers } from "@/lib/actions/createUser";

function DeclineModal({ setOpen, data }) {
  const queryClient = useQueryClient();

  const [selectedReason, setSelectedReason] = useState("");

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
      changeStatus(data.$id, "Canceled");
      queryClient.invalidateQueries("doctor_data");
    },
  });

  const { mutate: mutateUpdateDoctor } = useMutation({
    mutationFn: updateDoctor,
    onSuccess: () => {
      setOpen(false);
      setOpenModal(false);
      changeStatus(data.$id, "Canceled");
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

  const handleReasonChange = (event) => {
    setSelectedReason(event.target.value);
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
          status: "Canceled",
          appointmentId: JSON.stringify(data),
          reason: selectedReason,
        },
        id,
      ]);
    } else {
      mutateCreateDoctor({
        status: "Canceled",
        appointmentId: JSON.stringify(data),
        reason: selectedReason,
      });
    }

    mutateSendSMS({
      content: `Hi it's CarePulse. We regret to inform you that your appointment has been cancelled for the following reason: ${selectedReason}`,
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
              <h2>Cancel Appointment</h2>
              <IoClose
                className={styles.close_button}
                onClick={() => handleClose()}
              />
            </div>
            <div className={styles.col}>
              <p>Are you sure you want to cancel your appointment</p>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              <p>Reason for cancellation</p>
            </div>
            <div className={styles.col}>
              <textarea
                value={selectedReason}
                onChange={handleReasonChange}
                name="reason"
                id={`cancel-reason_${data.$id}`}
                placeholder="ex: Urgent meeting came up"
              ></textarea>
            </div>
          </div>
          <button
            onClick={() => handleClick()}
            type="submit"
            className={styles.decline_button}
          >
            Cancel appointment
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeclineModal;

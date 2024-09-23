import { useEffect, useState } from "react";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import styles from "./AdminTable.module.css";
import { convertDate } from "@/lib/utils";
import DeclineModal from "./DeclineModal";
import AcceptModal from "./AcceptModal";
import { store } from "@/Store";
import { getDoctor } from "@/lib/actions/doctorActions";
import { FaCheck } from "react-icons/fa6";
import { FaRegHourglass } from "react-icons/fa";
import { FiX } from "react-icons/fi";

function AdminTable() {
  const [openAcceptModalId, setopenAcceptModalId] = useState(null);
  const [openDeclineModalId, setopenDeclineModalId] = useState(null);
  const [mutatedData, setMutatedData] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const dataPerPage = 4;

  const { setOpenModal } = store((state) => ({
    setOpenModal: state.setOpenModal,
  }));

  function handleAccept(id) {
    setOpenModal(true);
    setopenAcceptModalId(id);
  }

  function handleDecline(id) {
    setOpenModal(true);
    setopenDeclineModalId(id);
  }

  const { data: doctorData } = useQuery({
    queryKey: ["doctor_data"],
    queryFn: getDoctor,
  });

  const { data, getData } = store((state) => ({
    data: state.data,
    getData: state.getData,
  }));

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    if (data && doctorData) {
      const newData = data.map((d) => {
        const foundAppointment = doctorData?.documents.find((a) => {
          const appointment = JSON.parse(a.appointmentId);
          return appointment.patientId === d.patientId;
        });

        if (foundAppointment) {
          if (foundAppointment.status === "Scheduled")
            return {
              ...d,
              status: foundAppointment.status,
              scheduledDate: foundAppointment.date,
            };
          else
            return {
              ...d,
              status: foundAppointment.status,
              reason: foundAppointment.reason,
            };
        }

        return d;
      });
      setMutatedData(newData);
    }
  }, [data, doctorData]);

  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;
  const currentData = (mutatedData || data)?.slice(
    indexOfFirstData,
    indexOfLastData
  );

  const totalPages = Math.ceil((mutatedData || data)?.length / dataPerPage);

  return (
    <div className={styles.appointment_table}>
      <div className={styles.table_header}>
        <div className={styles.thr}>
          <div className={styles.thd}>Patinet</div>
          <div className={styles.thd}>Date</div>
          <div className={styles.thd}>Status</div>
          <div className={styles.thd}>Doctor</div>
          <div className={styles.thd}>Actions</div>
        </div>
      </div>
      <div className={styles.table_body}>
        {currentData?.map((d) => (
          <div key={d.$id}>
            {openAcceptModalId === d.$id && (
              <AcceptModal
                data={d}
                key={`${d.$id}-accept`}
                setOpen={setopenAcceptModalId}
              />
            )}
            {openDeclineModalId === d.$id && (
              <DeclineModal
                data={d}
                key={`${d.$id}-decline`}
                setOpen={setopenDeclineModalId}
              />
            )}
            <div className={styles.tr}>
              <div className={styles.td}>{d.patient}</div>
              <div className={styles.td}>{convertDate(d.date)}</div>
              {d.status === "pending" && (
                <div className={`${styles.td} ${styles.status_td}`}>
                  <div className={`${styles.pending_td}`}>
                    <FaRegHourglass className={styles.dp_none} /> {d.status}
                  </div>
                </div>
              )}
              {d.status === "Scheduled" && (
                <div className={`${styles.td} ${styles.status_td} `}>
                  <div className={`${styles.scheduled_td}`}>
                    <FaCheck className={styles.dp_none} /> {d.status}
                  </div>
                </div>
              )}
              {d.status === "Canceled" && (
                <div className={`${styles.td} ${styles.status_td} `}>
                  <div className={`${styles.canceled_td}`}>
                    <FiX className={styles.dp_none} /> {d.status}
                  </div>
                </div>
              )}
              <div className={styles.td}>{d.doctor}</div>
              <div className={styles.td}>
                <div className={styles.buttons}>
                  <div
                    className={styles.accept_btn}
                    onClick={() => handleAccept(d.$id)}
                  >
                    Schedule
                  </div>
                  <div
                    className={styles.decline_btn}
                    onClick={() => handleDecline(d.$id)}
                  >
                    Cancel
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.table_footer}>
        <div
          className={styles.left_btn}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          <FaLongArrowAltLeft className={styles.arrow} />
        </div>
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <div
              key={index + 1}
              className={currentPage === index + 1 ? styles.active : ""}
              onClick={() => handlePageChange(index + 1)}
            >
              <p> {index + 1}</p>
            </div>
          ))}
        </div>
        <div
          className={styles.left_btn}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          <FaLongArrowAltRight className={styles.arrow} />
        </div>
      </div>
    </div>
  );
}

export default AdminTable;

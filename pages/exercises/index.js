import { Grid } from "@mui/material";
import { useState } from "react";
import ExerciseHeaderInfo from "./components/ExerciseHeaderInfo";
import ExerciseHeaderTrainerInfo from "./components/exerciseHeaderTrainerInfo";
import ExerciseList from "./components/exerciseList";
import ExerciseModal from "./components/exerciseModal";

export default function Exercises() {
  const [modal, setModal] = useState({
    open: false,
    type: "create",
  });

  const handleModalOpen = (e, type, item) => {
    const obj = { ...modal, open: true, type };
    if (item) {
      obj.item = item;
    }
    setModal(obj);
  };
  const handleModalClose = () => {
    setModal({ ...modal, open: false });
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <ExerciseHeaderTrainerInfo />
        </Grid>
        <Grid item xs={12} md={4}>
          <ExerciseHeaderInfo />
        </Grid>
        <Grid item xs={12} md={12}>
          <ExerciseList handleModalOpen={handleModalOpen} />
        </Grid>
      </Grid>
      <ExerciseModal
        modal={modal}
        handleModal={handleModalOpen}
        handleClose={handleModalClose}
      />
    </>
  );
}

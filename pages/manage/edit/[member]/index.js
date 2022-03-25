import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useState } from "react";
import useMember from "../../../../effects/useMember";
import ManageCreateExercise from "./ManageCreateExercise";
import ManageUpdateExercise from "./manageUpdateExercise";

export default function ManageEdit() {
  const { query } = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { data: member, loading } = useMember(query?.member);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [exercises, setExercises] = useState([]);
  const handleSelectedDate = (date) => {
    setSelectedDate(new Date(date));
  };
  const handleExercises = (newExercises) => {
    setExercises(newExercises);
  };

  const handleAutocompleteClick = (e, exercise) => {
    if (!exercise) {
      return;
    }
    if (exercises.findIndex((e) => e.name === exercise.name) !== -1) {
      enqueueSnackbar("이미 존재하는 운동입니다", { variant: "warning" });
      return;
    }
    const copyExercises = [...exercises];
    setExercises([...copyExercises, exercise]);
  };

  const handleExerciseChange = (e) => {
    const { name, value } = e.target;
    const seq = name.split("-")[3];
    const copyExercises = [...exercises];
    const findExerciseIndex = copyExercises.findIndex(
      (exercise) => exercise.seq === +seq
    );
    copyExercises[findExerciseIndex].value = value;

    setExercises([...copyExercises]);
  };
  const handleExerciseDelete = (e, exercise) => {
    const copyExercises = [...exercises];
    const indexExercise = copyExercises.findIndex(
      (e) => e.seq === exercise.seq
    );
    copyExercises.splice(indexExercise, 1);
    setExercises([...copyExercises]);
  };

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (query?.date) {
    return (
      <ManageUpdateExercise
        member={member}
        handleExercises={handleExercises}
        exercises={exercises}
        selectedDate={selectedDate}
        handleSelectedDate={handleSelectedDate}
        handleAutocompleteClick={handleAutocompleteClick}
        handleExerciseChange={handleExerciseChange}
        handleExerciseDelete={handleExerciseDelete}
      />
    );
    // return <Box sx={{ color: "white" }}>update view</Box>;
  }
  return (
    <>
      <ManageCreateExercise
        member={member}
        handleExercises={handleExercises}
        exercises={exercises}
        selectedDate={selectedDate}
        handleSelectedDate={handleSelectedDate}
        handleAutocompleteClick={handleAutocompleteClick}
        handleExerciseChange={handleExerciseChange}
        handleExerciseDelete={handleExerciseDelete}
      />
      {/* <Box sx={{ color: "white" }}>create view</Box>; */}
    </>
  );
}

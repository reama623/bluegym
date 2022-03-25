import { useContext } from "react";
import AppContext from "../../../../core/contexts/AppContext";
import PageHeader from "../../../../components/pageHeader";
import { formatDate } from "../../../../utils/date";
import ManageExercise from "./manageExercise";

export default function ManageCreateExercise({
  member,
  handleExercises,
  exercises,
  selectedDate,
  handleSelectedDate,
  handleAutocompleteClick,
  handleExerciseChange,
  handleExerciseDelete,
}) {
  const trainer = useContext(AppContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const saveExercises = [];
    document
      .querySelectorAll(".today-exercise-input input")
      .forEach(({ name, value }) => {
        const seq = name.split("-")[3];
        saveExercises.push({
          seq,
          value,
        });
      });
    // console.log(memberId, user, saveExercises);
    const info = {
      member_id: member.id,
      trainer_id: trainer.id,
      group_name: trainer.group,
      date: formatDate(selectedDate, "yyyy-MM-dd"),
      exercise_type: trainer.data.exercise.type,
    };
    const d = saveExercises.map(({ seq, value }) => ({
      ...info,
      exercise_seq: +seq,
      exercise_desc: value,
    }));

    try {
      // console.log("create---result", d);
      await axios.post(`/todayexercise`, d);

      enqueueSnackbar("오늘의 운동 생성 성공", { variant: "success" });
      push(`/manage?user=${member.id}`);
    } catch (error) {
      enqueueSnackbar("오늘의 운동 생성 실패", { variant: "error" });
    }
  };

  return (
    <>
      <PageHeader title="오늘의 운동 생성" />
      <ManageExercise
        member={member}
        handleExercises={handleExercises}
        exercises={exercises}
        selectedDate={selectedDate}
        handleSelectedDate={handleSelectedDate}
        handleAutocompleteClick={handleAutocompleteClick}
        handleExerciseChange={handleExerciseChange}
        handleExerciseDelete={handleExerciseDelete}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

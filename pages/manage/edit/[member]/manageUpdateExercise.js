import { useRouter } from "next/router";
import { useEffect } from "react";
import PageHeader from "../../../../components/pageHeader";
import useTodayExercises from "../../../../effects/useTodayExercises";
import ManageExercise from "./manageExercise";

export default function ManageUpdateExercise({
  member,
  handleExercises,
  exercises,
  selectedDate,
  handleSelectedDate,
  handleAutocompleteClick,
  handleExerciseChange,
  handleExerciseDelete,
}) {
  const { query } = useRouter();
  const { data, loading, error } = useTodayExercises(
    member,
    query?.date,
    query?.date
  );
  // console.log("update--", loading, data, exercises);
  useEffect(() => {
    if (!loading) {
      handleExercises(data[0]?.values);
    }
  }, [loading]);

  const handleSubmit = () => {};
  return (
    <>
      <PageHeader title="오늘의 운동 수정" />
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

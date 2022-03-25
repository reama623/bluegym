import { Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useRouter } from "next/router";
import { useContext } from "react";
import BluegymButton from "../../../../components/bluegymButton";
import BluegymPicker from "../../../../components/bluegymPicker";
import AppContext from "../../../../core/contexts/AppContext";
import { formatDate } from "../../../../utils/date";
import AutocompleteExercise from "../components/manageAutocompleteMember";
import TypedExerciseList from "../components/manageEditExercises";

export default function ManageExercise({
  member,
  exercises,
  selectedDate,
  handleSelectedDate,
  handleAutocompleteClick,
  handleExerciseChange,
  handleExerciseDelete,
  handleSubmit,
}) {
  const trainer = useContext(AppContext);
  const { back } = useRouter();
  return (
    <Stack sx={{ color: "white" }} spacing={2}>
      <Box display="flex" alignItems="center">
        <Typography>{member?.name} 회원 오늘의 운동 생성</Typography>
        <BluegymButton color="error" sx={{ m: "0 3px" }} onClick={() => back()}>
          취소
        </BluegymButton>
        <BluegymButton color="primary" onClick={handleSubmit}>
          저장
        </BluegymButton>
      </Box>
      <Box>
        <Typography sx={{ mb: 1 }}>일자 선택</Typography>
        {/* <BluegymDatepicker /> */}
        <BluegymPicker
          value={formatDate(selectedDate, "yyyy-MM-dd")}
          onChange={handleSelectedDate}
        />
      </Box>
      <Box>
        <Typography sx={{ mb: 1 }}>운동 추가</Typography>
        <Box>
          <AutocompleteExercise
            trainer={trainer}
            handleClick={handleAutocompleteClick}
          />
        </Box>
        <Box>
          {/* {exercises.map((exercise) => (
    <Box key={exercise.id}>{exercise.name}</Box>
  ))} */}
          {trainer && (
            <TypedExerciseList
              trainer={trainer}
              exercises={exercises}
              handleTypedDescChange={handleExerciseChange}
              handleTypedDescDelete={handleExerciseDelete}
            />
          )}
        </Box>
      </Box>
    </Stack>
  );
}

import { Box, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import useMember from "../../../effects/useMember";
import PageHeader from "../../../components/pageHeader";
// import BluegymDatepicker from "../../../components/bluegymDatepicker";
import BluegymPicker from "../../../components/bluegymPicker";
import { Fragment, useContext, useState } from "react";
import { formatDate } from "../../../utils/date";
import useExercise from "../../../effects/useExercise";
import AppContext from "../../../core/contexts/AppContext";
import BluegymAutocomplete from "../../../components/bluegymAutocomplete";
import { useSnackbar } from "notistack";
import BluegymButton from "../../../components/bluegymButton";
import { DeleteForever } from "@mui/icons-material";
import classNames from "classnames";
import axios from "axios";

export default function CreateTodayExercise() {
  const user = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  const { query, back, push } = useRouter();
  const { memberId } = query;
  const { loading, data: member, error } = useMember(memberId);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const handleDate = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  const [exercises, setExercises] = useState([]);
  const handleExerciseClick = (e, exercise) => {
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

  const handleTypedDescChange = (e) => {
    const { name, value } = e.target;
    const seq = name.split("-")[3];
    const copyExercises = [...exercises];
    const findExerciseIndex = copyExercises.findIndex(
      (exercise) => exercise.seq === +seq
    );
    copyExercises[findExerciseIndex].value = value;

    setExercises([...copyExercises]);
  };
  const handleTypedDescDelete = (e, exercise) => {
    const copyExercises = [...exercises];
    const indexExercise = copyExercises.findIndex(
      (e) => e.seq === exercise.seq
    );
    copyExercises.splice(indexExercise, 1);
    setExercises([...copyExercises]);
  };

  const handleTypedDescSubmit = async (e) => {
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
      member_id: memberId,
      trainer_id: user.id,
      group_name: user.group,
      date: formatDate(selectedDate, "yyyy-MM-dd"),
      exercise_type: user.data.exercise.type,
    };
    const d = saveExercises.map(({ seq, value }) => ({
      ...info,
      exercise_seq: +seq,
      exercise_desc: value,
    }));

    try {
      await axios.post(`/todayexercise`, d);

      enqueueSnackbar("오늘의 운동 생성 성공", { variant: "success" });
      push(`/manage?user=${memberId}`);
    } catch (error) {
      enqueueSnackbar("오늘의 운동 생성 실패", { variant: "error" });
    }
  };

  const handleSubmit = () => {
    if (!user) {
      return;
    }
    if (user.data.exercise.type.toString() === "1") {
      return handleTypedDescSubmit;
    }
    if (user.data.exercise.type.toString() === "2") {
    }
  };

  return (
    <>
      <PageHeader title="운동 생성" />
      <Stack sx={{ color: "white" }} spacing={2}>
        <Box display="flex" alignItems="center">
          <Typography>
            {!loading && member.name} 회원 오늘의 운동 생성
          </Typography>
          <BluegymButton
            color="error"
            sx={{ m: "0 3px" }}
            onClick={() => back()}
          >
            취소
          </BluegymButton>
          <BluegymButton color="primary" onClick={handleSubmit()}>
            저장
          </BluegymButton>
        </Box>
        <Box>
          <Typography sx={{ mb: 1 }}>일자 선택</Typography>
          {/* <BluegymDatepicker /> */}
          <BluegymPicker
            value={formatDate(selectedDate, "yyyy-MM-dd")}
            onChange={handleDate}
          />
        </Box>
        <Box>
          <Typography sx={{ mb: 1 }}>운동 추가</Typography>
          <Box>
            <AutocompleteExercise
              trainer={user}
              handleClick={handleExerciseClick}
            />
          </Box>
          <Box>
            {/* {exercises.map((exercise) => (
              <Box key={exercise.id}>{exercise.name}</Box>
            ))} */}
            {user && (
              <TypedExerciseList
                trainer={user}
                exercises={exercises}
                handleTypedDescChange={handleTypedDescChange}
                handleTypedDescDelete={handleTypedDescDelete}
              />
            )}
          </Box>
        </Box>
      </Stack>
    </>
  );
}

function AutocompleteExercise({ trainer, handleClick }) {
  const { data, loading, error } = useExercise(trainer?.id);
  return (
    <>
      <BluegymAutocomplete
        loading={loading}
        placeholder="운동을 선택해주세요"
        options={data}
        onChange={handleClick}
        getOptionLabel={({ name }) => name}
        // onClose={(e) => console.log("close", e)}
      />
    </>
  );
}

function TypedExerciseList({
  trainer,
  exercises,
  handleTypedDescChange,
  handleTypedDescDelete,
}) {
  const { id, data } = trainer;
  if (data.exercise.type?.toString() === "1" && exercises.length) {
    return (
      <>
        <TypedDescExerciseList
          exercises={exercises}
          handleChange={handleTypedDescChange}
          handleDelete={handleTypedDescDelete}
        />
      </>
    );
  }
  return <Typography>운동을 추가해주세요</Typography>;
}

function TypedDescExerciseList({ exercises, handleChange, handleDelete }) {
  return (
    <>
      <Typography>오늘의 운동 리스트</Typography>
      {exercises.map((exercise) => (
        <Fragment key={exercise.seq}>
          <Typography fontWeight={700}>{exercise.name}</Typography>
          <Box key={exercise.seq} display="flex" alignItems="center">
            <TextField
              rows={5}
              name={`today-exercise-input-${exercise.seq}`}
              size="small"
              fullWidth
              sx={{ mr: 10, maxWidth: 500 }}
              onChange={handleChange}
              value={exercise.value}
              type="text"
              className={classNames(`today-exercise-input`)}
            />
            <BluegymButton
              size="small"
              color="error"
              onClick={(e) => handleDelete(e, exercise)}
            >
              <DeleteForever />
            </BluegymButton>
          </Box>
        </Fragment>
      ))}
    </>
  );
}

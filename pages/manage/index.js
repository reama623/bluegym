import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import AppContext from "../../core/contexts/AppContext";
import useMembers from "../../effects/useMembers";
import BluegymButton from "../../components/bluegymButton";
import PageHeader from "../../components/pageHeader";
import { Item } from "../../components/styleds";
import BluegymAutocomplete from "../../components/bluegymAutocomplete";

export default function Manage() {
  const [selectMember, setSelectMember] = useState(null);
  const handleSelectMember = (e, member) => {
    setSelectMember(member);
  };
  return (
    <>
      <PageHeader title="회원 운동 관리" />
      <Typography sx={{ color: "white", mb: 1 }}>회원 운동 관리</Typography>
      <Stack spacing={2} sx={{ color: "white" }}>
        <Box>
          <UsersOfTrainer
            member={selectMember}
            handleClick={handleSelectMember}
          />
        </Box>
        <Box>
          <Typography sx={{ mb: 1 }}>운동 리스트</Typography>
          <ExercisesOfTrainer member={selectMember} />
        </Box>
      </Stack>
    </>
  );
}

function UserChip({ name, ...props }) {
  return <Chip label={name} sx={{ mr: 2 }} variant="contained" {...props} />;
}

function UsersOfTrainer({ member, handleClick }) {
  const { push } = useRouter();
  const user = useContext(AppContext);
  const { data, loading, error } = useMembers(user?.id);

  const handleAddExercise = (e) => {
    push(`/manage/create/${member.id}`);
  };
  return (
    <Stack direction="row" spacing={2}>
      {/* <Autocomplete
        sx={{ width: 300 }}
        size="small"
        loading={loading}
        placeholder="회원을 선택해주세요"
        options={data}
        getOptionLabel={({ name }) => name}
        renderInput={(params) => <TextField {...params} />}
        onChange={(e, member) => handleClick(e, member)}
      /> */}
      <BluegymAutocomplete
        loading={loading}
        placeholder="회원을 선택해주세요"
        options={data}
        onChange={handleClick}
        getOptionLabel={({ name }) => name}
      />
      {member && (
        <BluegymButton onClick={handleAddExercise}>운동 추가</BluegymButton>
      )}
    </Stack>
  );
}

function ExercisesOfTrainer({ member }) {
  return (
    <Grid container spacing={2}>
      <ExerciseCard />
      <ExerciseCard />
    </Grid>
  );
}

function ExerciseCard() {
  return (
    <Grid item xs={6} sm={6} md={3} lg={3} xl={2}>
      <Item>
        <Typography>2022-03-01의 운동</Typography>
        <Box>운동 내용 설명</Box>
      </Item>
    </Grid>
  );
}

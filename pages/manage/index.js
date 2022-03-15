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
import { useContext, useEffect, useState } from "react";
import AppContext from "../../core/contexts/AppContext";
import useMembers from "../../effects/useMembers";
import BluegymButton from "../../components/bluegymButton";
import PageHeader from "../../components/pageHeader";
import { Item } from "../../components/styleds";
import BluegymAutocomplete from "../../components/bluegymAutocomplete";
import useTodayExercises from "../../effects/useTodayExercises";

export default function Manage() {
  const {
    query: { user },
    push,
  } = useRouter();
  const loginUser = useContext(AppContext);
  const { data, loading, error } = useMembers(loginUser?.id);
  const [searchTime, setSearchTime] = useState({
    startDate: "2022-03-01",
    endDate: "2022-03-31",
  });

  const [selectMember, setSelectMember] = useState(null);
  const handleSelectMember = (e, member) => {
    setSelectMember(member);
    push(`/manage${member ? `?user=${member.id}` : ""}`);
  };

  useEffect(() => {
    if (data && user) {
      const findUser = data?.find((d) => d.id === user);
      setSelectMember(findUser);
    }
  }, [data, user]);
  return (
    <>
      <PageHeader title="회원 운동 관리" />
      <Typography sx={{ color: "white", mb: 1 }}>회원 운동 관리</Typography>
      <Stack spacing={2} sx={{ color: "white" }}>
        <Box>
          <UsersOfTrainer
            data={data}
            loading={loading}
            member={selectMember}
            handleClick={handleSelectMember}
          />
        </Box>
        <Box>
          <Typography sx={{ mb: 1 }}>운동 리스트</Typography>
          <ExercisesOfTrainer member={selectMember} {...searchTime} />
        </Box>
      </Stack>
    </>
  );
}

function UserChip({ name, ...props }) {
  return <Chip label={name} sx={{ mr: 2 }} variant="contained" {...props} />;
}

function UsersOfTrainer({ data, loading, member, handleClick }) {
  const { push } = useRouter();

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
        value={member}
        onChange={handleClick}
        getOptionLabel={({ name }) => name}
      />
      {member && (
        <BluegymButton onClick={handleAddExercise}>운동 추가</BluegymButton>
      )}
    </Stack>
  );
}

function ExercisesOfTrainer({ member, startDate, endDate }) {
  const { data, loading, error } = useTodayExercises(
    member,
    startDate,
    endDate
  );
  console.log(data);
  return (
    <Grid container spacing={2}>
      {!loading && data.map((d) => <ExerciseCard key={d.key} item={d} />)}
    </Grid>
  );
}

function ExerciseCard({ item }) {
  const { key, values } = item;
  return (
    <Grid item xs={6} sm={6} md={3} lg={3} xl={2}>
      <Item>
        <Typography>{key} 운동</Typography>
        {values.map(({ name }, i) => (
          <Box key={i}>{name}</Box>
        ))}
      </Item>
    </Grid>
  );
}

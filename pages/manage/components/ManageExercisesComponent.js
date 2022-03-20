import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { Item } from "../../../components/styleds";
import useTodayExercises from "../../../effects/useTodayExercises";

export default function ManageExercisesComponent({
  member,
  start: startDate,
  end: endDate,
}) {
  const { data, loading, error } = useTodayExercises(
    member,
    startDate,
    endDate
  );
  if (!member) {
    return <ExerciseCard title="회원을 선택해주세요" />;
  }
  if (!data.length) {
    return <ExerciseCard title="운동이 업습니다" />;
  }
  return (
    <>
      <Typography sx={{ mb: 1 }}>
        운동 리스트
        {loading && <CircularProgress size={5} />}
      </Typography>
      <Grid container spacing={2}>
        {data.map((d) => (
          <ExerciseCard key={d.key} item={d} />
        ))}
      </Grid>
    </>
  );
}

function ExerciseCard({ item, title }) {
  if (!item) {
    return (
      <Grid item xs={6} sm={6} md={3} lg={3} xl={2}>
        <Item
          sx={{
            minHeight: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography>{title}</Typography>
        </Item>
      </Grid>
    );
  }
  const { key, values } = item;
  const handleClick = (e) => {
    console.log(item);
  };
  return (
    <Grid item xs={6} sm={6} md={3} lg={3} xl={2}>
      <Item
        sx={{
          minHeight: 200,
          cursor: "pointer",
          "&:hover": { backgroundColor: "#424649" },
        }}
        onClick={handleClick}
      >
        <Typography>
          <Box component="span" sx={{ fontWeight: 700 }}>
            {key}
          </Box>{" "}
          운동
        </Typography>
        {values?.map(({ name }, i) => (
          <Box key={i}>{name}</Box>
        ))}
      </Item>
    </Grid>
  );
}

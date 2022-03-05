import {
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  Chip,
  ListItemText,
  Stack,
  Button,
  LinearProgress,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import useExercise from "../lib/useExercise";
import useUser from "../lib/useUser";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const StyledListItem = styled(ListItem)(({ theme }) => {
  return {
    "&:hover": { backgroundColor: theme.palette.action.hover, borderRadius: 5 },
  };
});

export default function Exercises() {
  const { user, loading } = useUser("trainer1");
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Item>trainer infomation</Item>
      </Grid>
      <Grid item xs={12} md={4}>
        <Item>trainer exercise infomation</Item>
      </Grid>
      <Grid item md={12}>
        <ExerciseList trainer={user} />
      </Grid>
    </Grid>
  );
}

/**
 * 이건 서버에서 불러와서 뿌려주는게 더 빠를듯
 */
function ExerciseList({ trainer }) {
  const { exercise, loading } = useExercise(trainer?.id);
  return (
    <Item>
      <Stack>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="center"
        >
          <Typography>{trainer?.id}님의 운동 리스트</Typography>
          <Button variant="contained" color="info" size="small">
            운동 추가
          </Button>
        </Stack>
        <Box sx={{ m: "10px 0", height: 10 }}>
          {loading && <LinearProgress />}
        </Box>
        <ListComponent items={exercise} />
      </Stack>
      {/* <DataTable data={exercise} /> */}
    </Item>
  );
}

function ListComponent({ items }) {
  return (
    <List>
      {items?.map((item) => (
        <ListComponentItem key={item.uid} item={item} />
      ))}
    </List>
  );
}

function ListComponentItem({ item }) {
  return (
    <StyledListItem>
      <Stack direction="row" spacing={2} alignItems="center">
        <Chip label={item.category} sx={{ width: 50, maxWidth: 100 }} />
        <ListItemText>{item.name}</ListItemText>
      </Stack>
    </StyledListItem>
  );
}

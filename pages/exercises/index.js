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
  Skeleton,
  Modal,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { date } from "../../utils/date";
import useExercise from "../lib/useExercise";
import useExerciseCount from "../lib/useExerciseCount";
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
  const { data, loading: c_loading } = useExerciseCount(user?.id);

  const [modal, setModal] = useState({
    create: {
      open: false,
    },
  });

  const handleModalOpen = (type) => {
    setModal({ ...modal, [type]: { open: true } });
  };
  const handleModalClose = (type) => {
    setModal({ ...modal, [type]: { open: false } });
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Item>
            <Box>
              <Typography>{date.today()}</Typography>
            </Box>
            <Box>기타 정보</Box>
          </Item>
        </Grid>
        <Grid item xs={12} md={4}>
          <Item>
            {loading ? (
              <Skeleton variant="rectangular" />
            ) : (
              <Box>{user?.name} 님</Box>
            )}
            {c_loading ? (
              <Skeleton variant="rectangular" />
            ) : (
              <Box>등록한 운동 개수 : {c_loading ? "-" : data?.count}</Box>
            )}
          </Item>
        </Grid>
        <Grid item xs={12} md={12}>
          <ExerciseList
            trainer={user}
            handleModalOpen={() => handleModalOpen("create")}
          />
        </Grid>
      </Grid>
      <ModalCreateExercise
        open={modal.create.open}
        handleClose={() => handleModalClose("create")}
      />
    </>
  );
}

/**
 * 이건 서버에서 불러와서 뿌려주는게 더 빠를듯
 */
function ExerciseList({ trainer, handleModalOpen }) {
  const { exercise, e_loading } = useExercise(trainer?.id);
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
          <Button
            variant="contained"
            color="info"
            size="small"
            onClick={handleModalOpen}
          >
            운동 추가
          </Button>
        </Stack>
        <Box sx={{ m: "10px 0", height: 10 }}>
          {e_loading && <LinearProgress />}
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
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function ModalCreateExercise({ open, handleClose }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="exercise-create-modal"
      // aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Text in a modal
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>
      </Box>
    </Modal>
  );
}

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
  FormGroup,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useContext, useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import AppContext from "../../core/contexts/AppContext";
import { date } from "../../utils/date";
import ConfirmModal from "../components/confirmModal";
import useExercise from "../lib/useExercise";
import useExerciseCount from "../lib/useExerciseCount";

const Item = styled(Paper)(({ theme }) => {
  return {
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  };
});

const StyledListItem = styled(ListItem)(({ theme }) => {
  return {
    "&:hover": { backgroundColor: theme.palette.action.hover, borderRadius: 5 },
  };
});

export default function Exercises() {
  const user = useContext(AppContext);
  const { data, loading } = useExerciseCount(user?.id);

  const [modal, setModal] = useState({
    open: false,
    type: "create",
  });

  const handleModalOpen = (e, type, item) => {
    const obj = { ...modal, open: true, type };
    if (item) {
      obj.item = item;
    }
    setModal(obj);
  };
  const handleModalClose = () => {
    setModal({ ...modal, open: false });
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
            {user ? (
              <>
                {loading ? (
                  <Skeleton variant="rectangular" />
                ) : (
                  <Box>{user?.name} 님</Box>
                )}
                {loading ? (
                  <Skeleton variant="rectangular" />
                ) : (
                  <Box>등록한 운동 개수 : {loading ? "-" : data?.count}</Box>
                )}
              </>
            ) : (
              "로그인이 필요합니다"
            )}
          </Item>
        </Grid>
        <Grid item xs={12} md={12}>
          <ExerciseList trainer={user} handleModalOpen={handleModalOpen} />
        </Grid>
      </Grid>
      <ModalExercise
        modal={modal}
        handleModal={handleModalOpen}
        handleClose={handleModalClose}
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
            onClick={(e) => handleModalOpen(e, "create")}
          >
            운동 추가
          </Button>
        </Stack>
        <Box sx={{ m: "10px 0", height: 10 }}>
          {e_loading && <LinearProgress />}
        </Box>
        {e_loading ? (
          <>
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
            <Skeleton animation="wave" />
          </>
        ) : (
          <ListComponent items={exercise} handleClick={handleModalOpen} />
        )}
      </Stack>
      {/* <DataTable data={exercise} /> */}
    </Item>
  );
}

function ListComponent({ items, handleClick }) {
  return (
    <List>
      {items?.map((item) => (
        <ListComponentItem
          key={item.uid}
          item={item}
          handleClick={handleClick}
        />
      ))}
    </List>
  );
}

function ListComponentItem({ item, handleClick }) {
  const label = item.category === "" ? "-" : item.category;
  return (
    // <StyledListItem onClick={(e) => handleClick(e, "update", item)}>
    <StyledListItem onClick={(e) => handleClick(e, "view", item)}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Chip label={label} sx={{ width: 50, maxWidth: 100 }} />
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

function ModalExercise({ modal, handleModal, handleClose }) {
  const user = useContext(AppContext);
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = useSWRConfig();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const [childModal, setChildModal] = useState({
    open: false,
    type: "update",
  });

  const handleCloseChildModal = (e) => {};

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleDescription = (e) => {
    setDescription(e.target.value);
  };
  const handleCategory = (e) => {
    setCategory(e.target.value);
  };

  const initializeState = () => {
    setTitle("");
    setDescription("");
    setCategory("");
  };

  const closeProcess = () => {
    mutate(["getExercise", user.id]);
    mutate(["getExerciseCount", user.id]);
    handleClose();

    initializeState();
  };

  const handleCreateExercise = async (e) => {
    e.preventDefault();
    if (title === "") {
      enqueueSnackbar("운동 이름을 입력해주세요", {
        variant: "warning",
        anchorOrigin: { horizontal: "right", vertical: "top" },
        preventDuplicate: true,
      });
      return;
    }
    try {
      const data = {
        name: title,
        desc: description,
        category,
        trainerId: user.id,
        groupId: user.group,
      };
      await axios.post("/exercise", data);
      enqueueSnackbar("운동 생성 완료", { variant: "success" });

      closeProcess();
    } catch (error) {
      enqueueSnackbar("운동 생성 실패", { variant: "error" });
    }
  };

  const handleDeleteExercise = async (e, { uid }) => {
    try {
      await axios.delete(`/exercise?id=${uid}`);
      enqueueSnackbar("운동 삭제 완료", { variant: "success" });
      closeProcess();
    } catch (error) {
      enqueueSnackbar("운동 삭제 실패", { variant: "error" });
    }
  };

  const handleUpdateExercise = async (e) => {
    e.preventDefault();
    try {
      const data = {
        uid: modal.item.uid,
        name: title,
        desc: description,
        category,
        trainerId: user.id,
        groupId: user.group,
      };
      await axios.patch(`/exercise`, data);
      enqueueSnackbar("운동 수정 완료", { variant: "success" });
      closeProcess();
    } catch (error) {
      enqueueSnackbar("운동 수정 실패", { variant: "error" });
    }
  };

  useEffect(() => {
    if (modal.type === "update") {
      const { name, desc, category } = modal.item;
      setTitle(name);
      setDescription(desc);
      setCategory(category);
    }
    if (!modal.open) {
      initializeState();
    }
  }, [modal]);

  const handleSubmit = (e) => {
    if (modal.type === "create") {
      return handleCreateExercise;
    }
    if (modal.type === "update") {
      return handleUpdateExercise;
    }
  };

  const handleModalType = (e, type) => {
    handleModal(e, type);
  };
  return (
    <Modal
      open={modal.open}
      onClose={() => handleClose()}
      aria-labelledby="exercise-create-modal"
      // aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{ color: "white" }}
        >
          {modal.type === "create" && "운동 생성"}
          {modal.type === "update" && "운동 수정"}
        </Typography>
        <form onSubmit={handleSubmit()}>
          {modal.type === "view" && (
            <ExerciseDisplay
              title={modal.item.name}
              description={modal.item.desc}
              category={modal.item.category}
              // handleUpdateView={handleUpdateView}
            />
          )}
          {(modal.type === "update" || modal.type === "create") && (
            <ExerciseUpdateView
              title={title}
              description={description}
              category={category}
              handleTitle={handleTitle}
              handleDescription={handleDescription}
              handleCategory={handleCategory}
            />
          )}

          <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
            {(modal.type === "create" || modal.type === "update") && (
              <>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ mr: 2 }}
                  onClick={(e) => handleModalType(e, "view")}
                >
                  취소
                </Button>
                <Button variant="contained" color="primary" type="submit">
                  저장
                </Button>
              </>
            )}

            {modal.type === "view" && (
              <>
                <Button
                  variant="contained"
                  color="warning"
                  sx={{ mr: 2 }}
                  onClick={(e) => handleDeleteExercise(e, modal.item)}
                >
                  삭제
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mr: 2 }}
                  onClick={(e) => handleModalType(e, "update")}
                >
                  수정
                </Button>
                <Button variant="contained" color="error" onClick={handleClose}>
                  닫기
                </Button>
              </>
            )}
          </Stack>
        </form>
      </Box>
      {/* <ConfirmModal modal={childModal} handleClose={handleCloseChildModal} /> */}
    </Modal>
  );
}

function ExerciseUpdateView({
  title,
  description,
  category,
  handleTitle,
  handleDescription,
  handleCategory,
}) {
  return (
    <>
      <TextField
        id="create-exercise-title"
        label="운동 이름"
        variant="outlined"
        margin="normal"
        fullWidth
        value={title}
        onChange={handleTitle}
      />
      <TextField
        id="create-exercise-description"
        multiline
        maxRows={6}
        label="운동 설명"
        variant="outlined"
        margin="normal"
        fullWidth
        value={description}
        onChange={handleDescription}
      />
      <TextField
        id="create-exercise-category"
        multiline
        maxRows={6}
        label="운동 분류"
        variant="outlined"
        margin="normal"
        fullWidth
        value={category}
        onChange={handleCategory}
      />
    </>
  );
}

function ExerciseDisplay({ title, description, category }) {
  return (
    <Box>
      <Stack>
        <Box>
          <Typography sx={{ color: "white", fontWeight: 600 }}>
            운동 이름
          </Typography>
          <Typography sx={{ color: "white" }}>{title}</Typography>
        </Box>
        <Box sx={{ m: "5px 0" }}>
          <Typography sx={{ color: "white", fontWeight: 600 }}>
            운동 설명
          </Typography>
          <Typography sx={{ color: "white" }}>{description}</Typography>
        </Box>
        <Box>
          <Typography sx={{ color: "white", fontWeight: 600 }}>
            운동 분류
          </Typography>
          <Typography sx={{ color: "white" }}>{category}</Typography>
        </Box>
      </Stack>
    </Box>
  );
}

import { Modal, Box, Typography, Stack } from "@mui/material";
import { useRouter } from "next/router";
import BluegymButton from "../../../components/bluegymButton";
import { modalStyle } from "../../../components/styleds";

export default function ManageTodayExerciseModal({ modal, handleClose }) {
  const { push } = useRouter();
  const { open, member, item } = modal;

  const redirectUpdate = () => {
    push(`/manage/edit/${member.id}?date=${item.key}`);
  };
  return (
    <Modal
      open={open}
      onClose={() => handleClose()}
      aria-labelledby="exercise-create-modal"
      // aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          sx={{ color: "white", mb: 2 }}
        >
          {member.name} 회원 | {item.key} 운동
        </Typography>
        <Stack color="white" spacing={1}>
          {item.values.map((value) => {
            return (
              <Box key={value.seq}>
                <Typography fontWeight={600}>{value.name}</Typography>
                <Typography>{value.exercise_desc}</Typography>
              </Box>
            );
          })}
        </Stack>

        <Stack direction="row" justifyContent="flex-end" sx={{ mt: 2 }}>
          <BluegymButton
            color="secondary"
            sx={{ mr: 2 }}
            onClick={redirectUpdate}
          >
            수정
          </BluegymButton>
          <BluegymButton onClick={handleClose}>닫기</BluegymButton>
        </Stack>
      </Box>
      {/* <ConfirmModal modal={childModal} handleClose={handleCloseChildModal} /> */}
    </Modal>
  );
}

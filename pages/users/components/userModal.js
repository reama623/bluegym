import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import { dateUtil } from "../../../utils/date";
import { modalStyle } from "../../components/styleds";

export default function UserModal({ modal, handleClose }) {
  return (
    <Modal
      open={modal.open}
      onClose={() => handleClose()}
      aria-labelledby={`user-${modal.type}-modal`}
      // aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        <UserView user={modal.user} />
        <Stack direction="row">
          {modal.type === "view" && (
            <>
              <Button variant="contained" color="error">
                삭제
              </Button>
              <Button variant="contained" color="warning" sx={{ m: "0 10px" }}>
                수정
              </Button>
            </>
          )}
          <Button variant="contained" color="secondary" onClick={handleClose}>
            닫기
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}

function UserView({ user }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Stack>
        <UserViewItem title="사용자 이름" text={user.name} />
        <UserViewItem
          title="사용자 등록일"
          text={dateUtil.formatDate(user.created_at)}
        />
        <UserViewItem title="사용자 소속" text={user.group} />
      </Stack>
    </Box>
  );
}

function UserViewItem({ title, text }) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography sx={{ color: "white", fontWeight: 600 }}>{title}</Typography>
      <Typography sx={{ color: "white" }}>{text}</Typography>
    </Box>
  );
}

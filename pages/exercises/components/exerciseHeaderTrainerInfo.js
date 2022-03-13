import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { dateUtil } from "../../../utils/date";
import { Item } from "../../../components/styleds";

export default function ExerciseHeaderTrainerInfo() {
  return (
    <Item>
      <Box>
        <Typography>{dateUtil.today()}</Typography>
      </Box>
      <Box>기타 정보</Box>
    </Item>
  );
}

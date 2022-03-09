import { ListItem, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

export const Item = styled(Paper)(({ theme }) => {
  return {
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  };
});

export const StyledListItem = styled(ListItem)(({ theme }) => {
  return {
    "&:hover": { backgroundColor: theme.palette.action.hover, borderRadius: 5 },
  };
});

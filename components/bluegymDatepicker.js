import { Button } from "@mui/material";
import { forwardRef } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default function BluegymDatepicker({
  startDate = new Date(),
  handleChange,
  type,
}) {
  const CustomInputComponent = forwardRef(({ value, onClick }, ref) => (
    // <ButtonComponent ref={ref} />
    // <DateButton date={startDate} onClick={onClick} ref={ref}>
    //   {value}
    // </DateButton>
    <Button ref={ref} onClick={onClick}>
      {value}
    </Button>
  ));
  CustomInputComponent.displayName = "CustomInput";

  return (
    <DatePicker
      selected={startDate}
      onChange={handleChange}
      customInput={<CustomInputComponent />}
    />
  );
}

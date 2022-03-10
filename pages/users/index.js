import { useContext, useState } from "react";
import AppContext from "../../core/contexts/AppContext";
import { dateUtil } from "../../utils/date";
import BluegymTable from "../components/BluegymTable";
import PageHeader from "../components/pageHead";
import useUsers from "../lib/useUsers";
import UserModal from "./components/userModal";

const columns = [
  { id: "id", label: "ID", align: "center", minWidth: 170 },
  { id: "name", label: "이름", align: "center", minWidth: 170, type: "string" },
  {
    id: "created_at",
    label: "등록일",
    minWidth: 170,
    align: "center",
    format: (value) => dateUtil.formatDate(value),
    type: "date",
  },
];

export default function Users() {
  const user = useContext(AppContext);
  const { data, error, loading } = useUsers(user?.id);
  const [modal, setModal] = useState({
    open: false,
    type: "view",
  });
  const handleClose = () => {
    setModal({ ...modal, open: false });
  };

  const handleUserClick = (e, user) => {
    setModal({ ...modal, open: true, user });
  };
  return (
    <>
      <PageHeader title="회원 관리" />
      <BluegymTable
        loading={loading}
        columns={columns}
        rows={data}
        handleRowClick={handleUserClick}
      />
      <UserModal modal={modal} handleClose={handleClose} />
    </>
  );
}

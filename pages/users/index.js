import { useContext } from "react";
import AppContext from "../../core/contexts/AppContext";
import { dateUtil } from "../../utils/date";
import BluegymTable from "../components/BluegymTable";
import PageHeader from "../components/pageHead";
import useUsers from "../lib/useUsers";

const columns = [
  { id: "id", label: "ID", minWidth: 170 },
  { id: "name", label: "이름", minWidth: 170 },
  {
    id: "created_at",
    label: "등록일",
    minWidth: 170,
    format: (value) => dateUtil.formatDate(value),
    type: "date",
  },
  // { id: "code", label: "ISO\u00a0Code", minWidth: 100 },
  // {
  //   id: "population",
  //   label: "Population",
  //   minWidth: 170,
  //   align: "right",
  //   format: (value) => value.toLocaleString("en-US"),
  // },
  // {
  //   id: "size",
  //   label: "Size\u00a0(km\u00b2)",
  //   minWidth: 170,
  //   align: "right",
  //   format: (value) => value.toLocaleString("en-US"),
  // },
  // {
  //   id: "density",
  //   label: "Density",
  //   minWidth: 170,
  //   align: "right",
  //   format: (value) => value.toFixed(2),
  // },
];

export default function Users() {
  const user = useContext(AppContext);
  const { data, error, loading } = useUsers(user?.id);
  return (
    <>
      <PageHeader title="회원 관리" />
      <BluegymTable loading={loading} columns={columns} rows={data} />
    </>
  );
}

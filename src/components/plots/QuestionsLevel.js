import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CircularProgress from "@material-ui/core/CircularProgress";

function parseData(apiData) {
  const data = [
    {
      name: "Easy",
      count: apiData.ac_easy,
    },
    {
      name: "Medium",
      count: apiData.ac_medium,
    },
    {
      name: "Hard",
      count: apiData.ac_hard,
    },
  ];
  return data;
}

export default function QuestionsLevel({ apiData }) {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState("");

  React.useEffect(() => {
    setData(parseData(apiData));
  }, [apiData]);

  React.useEffect(() => {
    setLoading(false);
  }, [data]);

  return loading ? (
    <CircularProgress />
  ) : (
    <ResponsiveContainer height={300}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

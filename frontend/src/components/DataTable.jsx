import React from "react";

const DataTable = ({ data }) => {
  return (
    <table className="table table-bordered mt-4">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nama</th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;

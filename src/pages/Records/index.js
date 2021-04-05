import React from "react";
import { Table, Input, Button, Space, DatePicker, Row, Col } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import * as S from "./styles";

const data = [];

for (let i = 0; i < 100; i++) {
  data.push({
    key: i,
    name: "Name " + i,
    phone: parseInt(Math.random() * 10),
    address: "Address of name " + i,
    date: new Date(),
    age: 10,
    gender: "female",
    email: "abc@gmail.com",
    paymentMethod: "cash",
    totalCost: 1000,
    totalTreatments: 2,
    nextAppointment: new Date(),
    treatments: [
      {
        treatment: "Headache",
        charges: 500,
      },
      {
        treatment: "BackPain",
        charges: 500,
      },
    ],
  });
}

class Records extends React.Component {
  state = {
    searchText: "",
    searchedColumn: "",
  };

  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            this.handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => this.handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: (text) =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: "" });
  };

  render() {
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: "33%",
        ...this.getColumnSearchProps("name"),
      },
      {
        title: "Phone Number",
        dataIndex: "phone",
        key: "phone",
        width: "33%",
        ...this.getColumnSearchProps("phone"),
      },
      {
        title: "Address",
        dataIndex: "address",
        key: "address",
        ...this.getColumnSearchProps("address"),
      },
    ];
    return (
      <S.Container>
        <Table
          columns={columns}
          dataSource={data}
          expandable={{
            expandedRowRender: (record) => (
              <>
                <S.ExpandableContainer>
                  <S.ExpandableRow align="middle" justify="center">
                    <S.ExpandableCol span="12">
                      <S.Label>Date of visit :</S.Label>
                    </S.ExpandableCol>
                    <S.ExpandableCol span="12">
                      {record.date.getDate()}
                    </S.ExpandableCol>
                  </S.ExpandableRow>

                  <S.ExpandableRow align="middle" justify="center">
                    <S.ExpandableCol span="12">
                      <S.Label>Age :</S.Label>
                    </S.ExpandableCol>
                    <S.ExpandableCol span="12">{record.age}</S.ExpandableCol>
                  </S.ExpandableRow>

                  <S.ExpandableRow align="middle" justify="center">
                    <S.ExpandableCol span="12">
                      <S.Label>Gender :</S.Label>
                    </S.ExpandableCol>
                    <S.ExpandableCol span="12">{record.gender}</S.ExpandableCol>
                  </S.ExpandableRow>

                  <S.ExpandableRow align="middle" justify="center">
                    <S.ExpandableCol span="12">
                      <S.Label>E-mail :</S.Label>
                    </S.ExpandableCol>
                    <S.ExpandableCol span="12">{record.email}</S.ExpandableCol>
                  </S.ExpandableRow>

                  <S.ExpandableRow align="middle" justify="center">
                    <S.ExpandableCol span="12">
                      <S.Label>Payment Method :</S.Label>
                    </S.ExpandableCol>
                    <S.ExpandableCol span="12">
                      {record.paymentMethod}
                    </S.ExpandableCol>
                  </S.ExpandableRow>

                  <S.ExpandableRow align="middle" justify="center">
                    <S.ExpandableCol span="12">
                      <S.Label>Total Cost :</S.Label>
                    </S.ExpandableCol>
                    <S.ExpandableCol span="12">
                      {record.totalCost}
                    </S.ExpandableCol>
                  </S.ExpandableRow>

                  <S.ExpandableRow align="middle" justify="center">
                    <S.ExpandableCol span="12">
                      <S.Label>Total Treatments :</S.Label>
                    </S.ExpandableCol>
                    <S.ExpandableCol span="12">
                      {record.totalTreatments}
                    </S.ExpandableCol>
                  </S.ExpandableRow>

                  <S.ExpandableRow align="middle" justify="center">
                    <S.ExpandableCol span="12">
                      <S.Label>Next Appointment :</S.Label>
                    </S.ExpandableCol>
                    <S.ExpandableCol span="12">
                      <DatePicker
                        size="small"
                        onChange={(date) => console.log(date._d)}
                      />
                    </S.ExpandableCol>
                  </S.ExpandableRow>

                  <S.ExpandableRow align="middle" justify="center">
                    <S.ExpandableCol span="12"></S.ExpandableCol>
                    <S.ExpandableCol span="12">
                      <Button type="default" size="small">
                        Update
                      </Button>
                    </S.ExpandableCol>
                  </S.ExpandableRow>

                  <S.ExpandableRow align="middle" justify="center">
                    <S.ExpandableCol span="24">
                      <S.Label>Treatments</S.Label>
                    </S.ExpandableCol>
                  </S.ExpandableRow>

                  {record.treatments.map((treatment, index) => {
                    return (
                      <div key={index}>
                        <hr />
                        <S.ExpandableRow>
                          <S.ExpandableCol span="24">
                            <Row>
                              <Col span={12}>Treatment :</Col>
                              <Col span={12}>{treatment.treatment}</Col>
                            </Row>
                            <Row>
                              <Col span={12}>Charges :</Col>
                              <Col span={12}>{treatment.charges}</Col>
                            </Row>
                          </S.ExpandableCol>
                        </S.ExpandableRow>
                      </div>
                    );
                  })}

                  <S.ExpandableRow
                    align="middle"
                    justify="center"
                    style={{ textAlign: "center", marginTop: "20px" }}
                  >
                    <S.ExpandableCol span="24">
                      <Space>
                        <Button type="primary">Print Bill</Button>
                        <Button type="primary">Print Prescription</Button>
                      </Space>
                    </S.ExpandableCol>
                  </S.ExpandableRow>

                  <S.ExpandableRow
                    align="middle"
                    justify="center"
                    style={{ textAlign: "center", marginTop: "20px" }}
                  >
                    <S.ExpandableCol span="24">
                      <Button type="danger">Delete Record</Button>
                    </S.ExpandableCol>
                  </S.ExpandableRow>
                </S.ExpandableContainer>
              </>
            ),
          }}
          pagination={{ pphoneSize: 10 }}
        />
      </S.Container>
    );
  }
}

export default Records;

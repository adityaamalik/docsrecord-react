import React from "react";
import { Table, Input, Button, Space, Row, Col, message, Image } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined } from "@ant-design/icons";
import * as S from "./styles";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";

class Records extends React.Component {
  state = {
    searchText: "",
    searchedColumn: "",
    data: [],
    nextAppointmentDate: "",
    images: [],
  };

  componentDidMount() {
    const doctor = localStorage.getItem("docsrecordDoctor");

    axios
      .get(`/patients?doctor=${doctor}`)
      .then((response) => {
        this.setState({
          data: response.data,
        });
      })
      .catch((err) => {
        if (!!err.response && err.response.status === 401) {
          message
            .error("You are unauthorized user, please login first !")
            .then(() => (window.location.pathname = "/login"));
        }
      });
  }

  deleteRecord = (id) => {
    axios
      .delete(`/patients/${id}`)
      .then((response) => {
        console.log(response);
        message.success("Record deleted successfully !");
        const newData = this.state.data.filter((item) => {
          return item._id !== id;
        });

        this.setState({
          data: newData,
        });
      })
      .catch((err) => {
        console.log(err.response);
        message.error("Cannot delete the record. Try again !");
      });
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

  setNextAppointment = (id) => {
    console.log(this.state.nextAppointmentDate);
    axios
      .put(
        `/patients/${id}`,
        { next_appointment_date: this.state.nextAppointmentDate },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log(response);
        message.success("Next appointment added successfully");
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  onUploadPhotos = (id) => {
    const formData = new FormData();

    for (let image of this.state.images) {
      formData.append("images", image);
    }

    axios
      .put(`/patients/${id}`, formData)
      .then((response) => {
        const temp = this.state.data.filter((d) => {
          return d._id !== response.data._id;
        });
        temp.unshift(response.data);
        this.setState({
          data: temp,
        });
        document.getElementById("images").value = null;
        message.success("Successfully uploaded the photos");
      })
      .catch((err) => {
        message.error("Some error occured");
      });
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
        dataIndex: "phone_number",
        key: "phone_number",
        width: "33%",
        ...this.getColumnSearchProps("phone_number"),
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
          rowKey="_id"
          columns={columns}
          dataSource={this.state.data}
          expandable={{
            expandedRowRender: (record) => (
              <div key={record._key}>
                <S.ExpandableContainer>
                  <S.ExpandableRow align="middle" justify="center">
                    <S.ExpandableCol span="12">
                      <S.Label>Date of visit :</S.Label>
                    </S.ExpandableCol>
                    <S.ExpandableCol span="12">
                      {record.visit_date}
                    </S.ExpandableCol>
                  </S.ExpandableRow>

                  {record.age && (
                    <S.ExpandableRow align="middle" justify="center">
                      <S.ExpandableCol span="12">
                        <S.Label>Age :</S.Label>
                      </S.ExpandableCol>
                      <S.ExpandableCol span="12">{record.age}</S.ExpandableCol>
                    </S.ExpandableRow>
                  )}

                  {record.gender && (
                    <S.ExpandableRow align="middle" justify="center">
                      <S.ExpandableCol span="12">
                        <S.Label>Gender :</S.Label>
                      </S.ExpandableCol>
                      <S.ExpandableCol span="12">
                        {record.gender}
                      </S.ExpandableCol>
                    </S.ExpandableRow>
                  )}

                  {record.email && (
                    <S.ExpandableRow align="middle" justify="center">
                      <S.ExpandableCol span="12">
                        <S.Label>E-mail :</S.Label>
                      </S.ExpandableCol>
                      <S.ExpandableCol span="12">
                        {record.email}
                      </S.ExpandableCol>
                    </S.ExpandableRow>
                  )}

                  {record.total_cost && (
                    <S.ExpandableRow align="middle" justify="center">
                      <S.ExpandableCol span="12">
                        <S.Label>Total Cost :</S.Label>
                      </S.ExpandableCol>
                      <S.ExpandableCol span="12">
                        ₹ {record.total_cost}
                      </S.ExpandableCol>
                    </S.ExpandableRow>
                  )}

                  {record.treatments && (
                    <S.ExpandableRow align="middle" justify="center">
                      <S.ExpandableCol span="12">
                        <S.Label>Total Treatments :</S.Label>
                      </S.ExpandableCol>
                      <S.ExpandableCol span="12">
                        {record.treatments.length}
                      </S.ExpandableCol>
                    </S.ExpandableRow>
                  )}

                  <S.ExpandableRow align="middle" justify="center">
                    <S.ExpandableCol span="12">
                      <S.Label>Next Appointment :</S.Label>
                    </S.ExpandableCol>
                    <S.ExpandableCol span="12">
                      <input
                        type="date"
                        defaultValue={moment(
                          record.next_appointment_date
                        ).format("YYYY-MM-DD")}
                        onChange={(date) => {
                          this.setState({
                            nextAppointmentDate: date.target.value,
                          });
                        }}
                      />
                    </S.ExpandableCol>
                  </S.ExpandableRow>

                  <S.ExpandableRow align="middle" justify="center">
                    <S.ExpandableCol span="12"></S.ExpandableCol>
                    <S.ExpandableCol span="12">
                      <Button
                        type="default"
                        size="small"
                        onClick={() => this.setNextAppointment(record._id)}
                      >
                        Update
                      </Button>
                    </S.ExpandableCol>
                  </S.ExpandableRow>

                  <S.ExpandableRow align="middle" justify="center">
                    <S.ExpandableCol span={24}>
                      <label htmlFor="images">Select Image Gallery : </label>
                      <input
                        required
                        id="images"
                        type="file"
                        multiple
                        onChange={(e) => {
                          let arr = [];
                          for (let file of e.target.files) {
                            arr.push(file);
                          }
                          this.setState({
                            ...this.state,
                            images: [...arr],
                          });
                        }}
                      />
                      <Button onClick={() => this.onUploadPhotos(record._id)}>
                        Upload Photos
                      </Button>
                    </S.ExpandableCol>
                  </S.ExpandableRow>

                  <S.ExpandableRow>
                    <S.ExpandableCol span={24}>
                      {!!record.images &&
                        record.images.map((img, index) => {
                          return (
                            <Image
                              key={index}
                              src={`data:image/${
                                img.contentType
                              };base64,${img.data.toString("base64")}`}
                              alt="gallery image"
                              width="200px"
                              style={{ margin: "10px" }}
                            />
                          );
                        })}
                    </S.ExpandableCol>
                  </S.ExpandableRow>

                  {record.treatments && (
                    <S.ExpandableRow align="middle" justify="center">
                      <S.ExpandableCol span="24">
                        <S.Label>Treatments</S.Label>
                        <hr />
                      </S.ExpandableCol>
                    </S.ExpandableRow>
                  )}

                  {record.treatments &&
                    record.treatments.map((treatment, index) => {
                      return (
                        <div key={index}>
                          <S.ExpandableRow>
                            <S.ExpandableCol span="24">
                              <Row>
                                <Col span={12}>Treatment :</Col>
                                <Col span={12}>{treatment.treatment}</Col>
                              </Row>
                              <Row>
                                <Col span={12}>Charges :</Col>
                                <Col span={12}>₹ {treatment.charges}</Col>
                              </Row>
                            </S.ExpandableCol>
                          </S.ExpandableRow>
                          <hr />
                        </div>
                      );
                    })}

                  <S.ExpandableRow
                    align="middle"
                    justify="center"
                    style={{ textAlign: "center", marginTop: "20px" }}
                  >
                    <S.ExpandableCol span="24">
                      <Link
                        to={{
                          pathname: "/printbill",
                          state: { patient: record },
                        }}
                      >
                        <Button style={{ marginRight: "5px" }}>
                          Print Bill
                        </Button>
                      </Link>
                      <Link
                        to={{
                          pathname: "/printprescription",
                          state: { patient: record },
                        }}
                      >
                        <Button>Print Prescription</Button>
                      </Link>
                    </S.ExpandableCol>
                  </S.ExpandableRow>

                  <S.ExpandableRow
                    align="middle"
                    justify="center"
                    style={{ textAlign: "center", marginTop: "20px" }}
                  >
                    <S.ExpandableCol span="24">
                      <Link
                        to={{
                          pathname: "/updatepatient",
                          state: { id: record._id },
                        }}
                      >
                        <Button style={{ marginRight: "5px" }}>
                          Update Record
                        </Button>
                      </Link>
                      <Button
                        danger
                        onClick={() => this.deleteRecord(record._id)}
                      >
                        Delete Record
                      </Button>
                    </S.ExpandableCol>
                  </S.ExpandableRow>
                </S.ExpandableContainer>
              </div>
            ),
          }}
          pagination={{ pphoneSize: 10 }}
        />
      </S.Container>
    );
  }
}

export default Records;

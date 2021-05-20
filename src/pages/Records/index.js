import React from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Row,
  Col,
  message,
  Image,
  Avatar,
} from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined, CloudUploadOutlined } from "@ant-design/icons";
import * as S from "./styles";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment";
import DatePicker from "react-date-picker";
import TimePicker from "react-time-picker";

class Records extends React.Component {
  state = {
    searchText: "",
    searchedColumn: "",
    data: [],
    nextAppointmentDate: new Date(),
    nextAppointmentTime: "12:00",
    images: [],
    isLoading: false,
  };

  componentDidMount() {
    this.setState({
      isLoading: true,
    });

    axios
      .get(`https://docsrecord.herokuapp.com/patient`, {
        withCredentials: true,
      })
      .then((response) => {
        this.setState({
          data: response.data,
          isLoading: false,
        });
      })
      .catch((err) => {
        if (!!err.response && err.response.status === 401) {
          message
            .error("You are unauthorized user, please login first !", 1)
            .then(() => (window.location.pathname = "/"));
        }
        this.setState({
          isLoading: false,
        });
      });
  }

  deleteRecord = (id) => {
    axios
      .delete(`https://docsrecord.herokuapp.com/patient/${id}`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response);
        message.success("Record deleted successfully !", 1);
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

  tConvert = (time) => {
    // Check correct time format and split into components
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
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
    let today = new Date(this.state.nextAppointmentDate);

    axios
      .put(
        `https://docsrecord.herokuapp.com/patient/${id}`,
        {
          next_appointment_date: today,
          next_appointment_time: this.state.nextAppointmentTime,
        },
        { withCredentials: true }
      )
      .then((response) => {
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
          images: [],
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
          loading={this.state.isLoading}
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
                      <S.RightLabel>
                        {moment(record.visit_date).format("DD-MM-YYYY")}
                      </S.RightLabel>
                    </S.ExpandableCol>
                  </S.ExpandableRow>

                  {record.age && (
                    <S.ExpandableRow align="middle" justify="center">
                      <S.ExpandableCol span="12">
                        <S.Label>Age :</S.Label>
                      </S.ExpandableCol>
                      <S.ExpandableCol span="12">
                        <S.RightLabel>{record.age}</S.RightLabel>
                      </S.ExpandableCol>
                    </S.ExpandableRow>
                  )}

                  {record.gender && (
                    <S.ExpandableRow align="middle" justify="center">
                      <S.ExpandableCol span="12">
                        <S.Label>Gender :</S.Label>
                      </S.ExpandableCol>
                      <S.ExpandableCol span="12">
                        <S.RightLabel>{record.gender}</S.RightLabel>
                      </S.ExpandableCol>
                    </S.ExpandableRow>
                  )}

                  {record.email && (
                    <S.ExpandableRow align="middle" justify="center">
                      <S.ExpandableCol span="12">
                        <S.Label>E-mail :</S.Label>
                      </S.ExpandableCol>
                      <S.ExpandableCol span="12">
                        <S.RightLabel>{record.email}</S.RightLabel>
                      </S.ExpandableCol>
                    </S.ExpandableRow>
                  )}

                  {record.total_cost && (
                    <S.ExpandableRow align="middle" justify="center">
                      <S.ExpandableCol span="12">
                        <S.Label>Total Cost :</S.Label>
                      </S.ExpandableCol>
                      <S.ExpandableCol span="12">
                        <S.RightLabel>₹ {record.total_cost} /-</S.RightLabel>
                      </S.ExpandableCol>
                    </S.ExpandableRow>
                  )}

                  {record.treatments && (
                    <S.ExpandableRow align="middle" justify="center">
                      <S.ExpandableCol span="12">
                        <S.Label>Total Treatments :</S.Label>
                      </S.ExpandableCol>
                      <S.ExpandableCol span="12">
                        <S.RightLabel>{record.treatments.length}</S.RightLabel>
                      </S.ExpandableCol>
                    </S.ExpandableRow>
                  )}
                  {record.next_appointment_date && (
                    <S.ExpandableRow align="middle" justify="center">
                      <S.ExpandableCol span="12">
                        <S.Label>Next Appointment :</S.Label>
                      </S.ExpandableCol>
                      <S.ExpandableCol span="12">
                        <S.RightLabel>
                          {moment(record.next_appointment_date).format(
                            "MMMM Do YYYY"
                          )}{" "}
                          {!!record.next_appointment_time && (
                            <>({this.tConvert(record.next_appointment_time)})</>
                          )}
                        </S.RightLabel>
                      </S.ExpandableCol>
                    </S.ExpandableRow>
                  )}

                  <S.ExpandableRow align="middle" justify="center">
                    <S.ExpandableCol span="12">
                      <S.Label>Set Appointment :</S.Label>
                    </S.ExpandableCol>
                    <S.ExpandableCol span="12">
                      <S.RightLabel>
                        <Row align="middle">
                          <Col lg={8} md={24} sm={24} xs={24}>
                            Appointment date :
                          </Col>
                          <Col lg={16} md={24} sm={24} xs={24}>
                            <S.Picker>
                              <DatePicker
                                className="form-control"
                                onChange={(date) => {
                                  this.setState({
                                    nextAppointmentDate: date,
                                  });
                                }}
                                value={this.state.nextAppointmentDate}
                              />
                            </S.Picker>
                          </Col>
                        </Row>
                      </S.RightLabel>
                    </S.ExpandableCol>
                  </S.ExpandableRow>

                  <S.ExpandableRow align="middle" justify="center">
                    <S.ExpandableCol span="12"></S.ExpandableCol>
                    <S.ExpandableCol span="12">
                      <S.RightLabel>
                        <Row>
                          <Col lg={8} md={24} sm={24} xs={24}>
                            Appointment time :
                          </Col>
                          <Col lg={16} md={24} sm={24} xs={24}>
                            <S.Picker>
                              <TimePicker
                                amPmAriaLabel="Select AM/PM"
                                className="form-control"
                                locale="en-US"
                                hourPlaceholder="hh"
                                minutePlaceholder="mm"
                                onChange={(value) =>
                                  this.setState({
                                    ...this.state,
                                    nextAppointmentTime: value,
                                  })
                                }
                                value={this.state.nextAppointmentTime}
                              />
                            </S.Picker>
                          </Col>
                        </Row>
                      </S.RightLabel>
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

                  <br />
                  <S.ExpandableRow align="middle" justify="center">
                    <S.ExpandableCol span={12}>
                      <S.Label>Upload Patient Images : </S.Label>
                    </S.ExpandableCol>
                    <S.ExpandableCol span={12}>
                      <S.FileUploadLabel htmlFor="images">
                        <Avatar
                          icon={<CloudUploadOutlined />}
                          size={40}
                          style={{
                            backgroundColor: "transparent",
                            color: "black",
                          }}
                        />
                      </S.FileUploadLabel>
                      <S.FileUpload
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
                      <span style={{ marginRight: "10px" }}>
                        {this.state.images.length !== 0 &&
                          this.state.images.length + " images selected"}
                      </span>
                      <Button
                        size="small"
                        onClick={() => this.onUploadPhotos(record._id)}
                        disabled={this.state.images.length > 0 ? false : true}
                      >
                        Upload Photos
                      </Button>
                    </S.ExpandableCol>
                  </S.ExpandableRow>

                  <S.ExpandableRow align="middle">
                    {!!record.images &&
                      record.images.map((img, index) => {
                        return (
                          <S.ExpandableCol
                            key={index}
                            lg={6}
                            md={12}
                            sm={12}
                            xs={12}
                          >
                            <Image
                              src={`data:image/${
                                img.contentType
                              };base64,${img.data.toString("base64")}`}
                              alt="gallery image"
                              style={{
                                margin: "10px",
                                maxWidth: "80%",
                                maxHeight: "80%",
                                height: "auto",
                              }}
                            />
                          </S.ExpandableCol>
                        );
                      })}
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
                              <S.RightLabel>
                                <Row>
                                  <Col span={12}>Treatment :</Col>
                                  <Col span={12}>{treatment.treatment}</Col>
                                </Row>
                                <Row>
                                  <Col span={12}>Charges :</Col>
                                  <Col span={12}>₹ {treatment.charges} /-</Col>
                                </Row>
                              </S.RightLabel>
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

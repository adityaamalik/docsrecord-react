const AboutUs = () => {
  return (
    <>
      <h1 style={{ textAlign: "center", marginTop: "50px" }}>About Us</h1>

      <div style={{ padding: "20px" }}>
        <h3>Our Product</h3>
        <br />
        <br />
        <p>
          DOCSRECORD is a software built for doctors to manage their records.
          Record management is a necessity for doctors nowadays. Conventional
          way of storing records is hassle for a lot of doctors. <br />
          With DOCSRECORD, doctors can easily manage records, set appointments
          for their patients and send appointment updates to patients.
          <br />
          Updates to patients are sent automatically and doctors can easily view
          their appointments at a single glance.
          <br />
          Patients can also view statistics of their patient records from our
          product. Statistics are a very powerful tool for providing insights
          about your growth.
        </p>
        <br />
        <br />
        <h3>OUR VISION</h3>
        <br />
        <br />
        <p>
          With DOCSRECORD, we want revolutionize the way doctors manage their
          records. We want to make the process of managing records completely
          hassle free and autonomous for doctors.
          <br />
          Here at DOCSRECORD, we are working 24 * 7 to make our vision possible.
          <br />
          DOCSRECORD will make doctor's life easier and their career will boost
          with our help.
        </p>

        <br />
        <br />

        <h3>OUR TEAM</h3>
        <br />
        <br />
        <p>
          DOCSRECORD is a startup made by very young entreprenuers / students.
          It started as a minor project in 2020 but took various different forms
          and shapes to get where it is right now.
        </p>
        <br />

        <div style={{ textAlign: "center" }}>
          <img
            src="/assets/images/aditya.jpeg"
            alt="aditya malik"
            style={{
              height: "100px",
              width: "auto",
              borderRadius: "50%",
              marginRight: "50px",
            }}
          />
          <img
            src="/assets/images/altamash.jpeg"
            alt="altamash khan"
            style={{ height: "100px", width: "auto", borderRadius: "50%" }}
          />
        </div>
        <div style={{ textAlign: "center", marginTop: "5px" }}>
          <span style={{ marginRight: "70px" }}>Aditya Malik</span>
          <span>Altamash Khan</span>
        </div>

        <br />
        <p>Want to join our team ? </p>
        <p>Contact us : docsrecordmail@gmail.com</p>
      </div>
    </>
  );
};

export default AboutUs;

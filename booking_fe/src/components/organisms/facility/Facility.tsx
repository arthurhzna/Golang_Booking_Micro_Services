import {url} from "node:inspector";

export default function Facility() {
  return (
    <>
      <div className="untree_co-section" id="facility">
        <div className="container">
          <div className="row mb-5 justify-content-center">
            <div className="col-lg-6 text-center">
              <h2 className="section-title text-center mb-3 poppins-bold">
                Fasilitas
              </h2>
              <p className="poppins-regular">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magnam
                nam libero voluptates quis dolorum repellendus, ipsa tempora quo
                earum temporibus.
              </p>
            </div>
          </div>
          <div className="row align-items-stretch">
            <div className="col-lg-4 order-lg-1">
              <div className="h-100">
                <div className="frame h-100">
                  <div
                    className="feature-img-bg h-100"
                  ></div>
                </div>
              </div>
            </div>

            <div
              className="col-6 col-sm-6 col-lg-4 feature-1-wrap d-md-flex flex-md-column order-lg-1"
            >
              <div className="feature-1 d-md-flex">
                <div className="align-self-center">
                  <i className="fa-solid fa-door-open fa-4x"></i>
                  <h3 className="mt-2 poppins-bold">Ruang Ganti</h3>
                  <p className="mb-0 poppins-regular">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Corporis, vel!
                  </p>
                </div>
              </div>

              <div className="feature-1 d-md-flex">
                <div className="align-self-center">
                  <i className="fa-solid fa-utensils fa-4x"></i>
                  <h3 className="mt-2 poppins-bold">Restaurant & Cafe</h3>
                  <p className="mb-0 poppins-regular">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. A,
                    quia! Soluta.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="col-6 col-sm-6 col-lg-4 feature-1-wrap d-md-flex flex-md-column order-lg-3"
            >
              <div className="feature-1 d-md-flex">
                <div className="align-self-center">
                  <i className="fa-solid fa-car fa-4x"></i>
                  <h3 className="mt-2 poppins-bold">Parkiran</h3>
                  <p className="mb-0 poppins-regular">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi,
                    maiores.
                  </p>
                </div>
              </div>

              <div className="feature-1 d-md-flex">
                <div className="align-self-center">
                  <i className="fa-solid fa-mosque fa-4x"></i>
                  <h3 className="mt-2 poppins-bold">Mushola</h3>
                  <p className="mb-0 poppins-regular">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Molestiae, quaerat.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
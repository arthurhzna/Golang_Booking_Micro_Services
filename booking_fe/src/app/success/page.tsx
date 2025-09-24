import Head from "next/head";
import Link from "next/link";

export default function Success() {
  return (
    <>
      <Head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
        <script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js"
          defer
        ></script>
      </Head>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="vh-100 d-flex justify-content-center align-items-center">
              <div className="col-md-4">
                <div className="border border-3 border-danger"></div>
                <div className="card bg-white shadow p-5" style={{borderRadius: '1px'}}>
                  <div className="mb-4 text-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-danger bi bi-check-circle"
                      width="75"
                      height="75"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path
                        d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"
                      />
                      <path
                        d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <h1 className="poppins-bold">Terima Kasih !</h1>
                    <p className="poppins-medium">
                      Terima kasih telah melakukan pembayaran, Silahkan datang sesuai dengan jadwal yang telah dipilih :)
                    </p>
                    <Link href="/" className="btn btn-outline-danger">Back Home</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
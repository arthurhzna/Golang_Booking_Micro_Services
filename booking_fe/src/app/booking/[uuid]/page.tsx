import Header from "@/components/organisms/header/Header";
import 'owl.carousel/dist/assets/owl.carousel.css';
import '../../../styles/owl.theme.default.min.css';
import Footer from "@/components/organisms/footer/Footer";
import Detail from "@/components/organisms/detail/Detail";
import Schedule from "@/components/organisms/detail/Schedule";

export default function Booking({ params }: any) {
  const { uuid } = params;

  return (
    <>
      <Header />
      <div className="hero hero-inner">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mx-auto text-center">
              <div className="intro-wrap">
                <h1 className="mb-0 poppins-bold">Booking Jadwal</h1>
                <p className="text-white poppins-medium mt-2">
                  Silahkan pilih jadwal sesuai kebutuhan kamu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Detail params={{ uuid }} />
      <Schedule params={{ uuid }} />
      <Footer />
    </>
  );
}

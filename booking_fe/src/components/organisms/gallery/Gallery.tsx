'use client'
import dynamic from 'next/dynamic';
import 'owl.carousel/dist/assets/owl.carousel.css';
import '../../../styles/owl.theme.default.min.css';

const OwlCarousel = dynamic(() => import('react-owl-carousel'), { ssr: false });

export default function Gallery() {
  const options = {
    loop: true,
    margin: 10,
    autoplay: true,
    smartSpeed: 700,
    nav: true,
    dots: true,
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      800: { items: 2 },
      1000: { items: 2 },
      1100: { items: 3 },
    },
  };

  return (
    <>
      <div className="untree_co-section" id="gallery-list">
        <div className="container">
          <div className="row text-center justify-content-center mb-5">
            <div className="col-lg-7">
              <h2 className="section-title text-center poppins-bold">
                Galeri Lapangan
              </h2>
              <p className="poppins-regular">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Magnam
                nam libero voluptates quis dolorum repellendus, ipsa tempora quo
                earum temporibus.
              </p>
            </div>
          </div>

          <OwlCarousel className='owl-theme' {...options}>
            <div className='item'>
              <a
                className="media-thumb"
                href="images/field-1.jpg"
                data-fancybox="gallery"
              >
                <img src="images/field-1.jpg" alt="Image" className="img-fluid"/>
              </a>
            </div>
            <div className='item'>
              <a
                className="media-thumb"
                href="images/field-2.jpg"
                data-fancybox="gallery"
              >
                <img src="images/field-2.jpg" alt="Image" className="img-fluid"/>
              </a>
            </div>
            <div className='item'>
              <a
                className="media-thumb"
                href="images/field-3.jpg"
                data-fancybox="gallery"
              >
                <img src="images/field-3.jpg" alt="Image" className="img-fluid"/>
              </a>
            </div>
            <div className='item'>
              <a
                className="media-thumb"
                href="images/field-4.jpg"
                data-fancybox="gallery"
              >
                <img src="images/field-4.jpg" alt="Image" className="img-fluid"/>
              </a>
            </div>
          </OwlCarousel>
        </div>
      </div>
    </>
  )
}
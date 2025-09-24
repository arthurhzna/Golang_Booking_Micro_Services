'use client'
import {useState, useEffect} from 'react';

export default function Footer() {
  const [year, setYear] = useState<any>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <>
      <div className="site-footer">
        <div className="inner first">
          <div className="container">
            <div className="row">
              <div className="col-md-6 col-lg-4">
                <div className="widget">
                  <h3 className="heading poppins-bold">BWA Mini Soccer</h3>
                  <p className="poppins-regular">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Libero illo delectus maxime voluptatem
                    iure? Neque?
                  </p>
                </div>
                <div className="widget">
                  <ul className="list-unstyled social" style={{marginRight: '10px'}}>
                    <li><a href="#"><span className="icon-twitter"></span></a></li>
                    <li><a href="#"><span className="icon-instagram"></span></a></li>
                    <li><a href="#"><span className="icon-facebook"></span></a></li>
                    <li><a href="#"><span className="icon-linkedin"></span></a></li>
                    <li><a href="#"><span className="icon-dribbble"></span></a></li>
                    <li><a href="#"><span className="icon-pinterest"></span></a></li>
                    <li><a href="#"><span className="icon-apple"></span></a></li>
                    <li className="mr-3"><a href="#"><span className="icon-google"></span></a></li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6 col-lg-2 pl-lg-5">
                <div className="widget">
                  <h3 className="heading">Pages</h3>
                  <ul className="links list-unstyled">
                    <li><a href="#">Blog</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Contact</a></li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6 col-lg-2">
                <div className="widget">
                  <h3 className="heading">Resources</h3>
                  <ul className="links list-unstyled">
                    <li><a href="#">Blog</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Contact</a></li>
                  </ul>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="widget">
                  <h3 className="heading">Contact</h3>
                  <ul className="list-unstyled quick-info links">
                    <li className="email"><a href="#">mail@example.com</a></li>
                    <li className="phone"><a href="#">+1 222 212 3819</a></li>
                    <li className="address"><a href="#">43 Raymouth Rd. Baltemoer, London 3910</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="inner dark">
          <div className="container">
            <div className="row text-center">
              <div className="col-md-8 mb-3 mb-md-0 mx-auto">
                <p>
                  Copyright &copy; {year || 'Loading...'}.
                  All Rights Reserved. &mdash; Designed with love by
                  <a href="https://untree.co" className="link-highlight">Untree.co</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

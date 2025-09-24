'use client';
import React, { useEffect, useState } from "react";
import apiConfig from "@/config/api";
import crypto from "crypto";
import axios from "axios";
import dynamic from 'next/dynamic';
import 'owl.carousel/dist/assets/owl.carousel.css';
import '../../../styles/owl.theme.default.min.css';
import { toast } from "react-toastify";
import { message } from "@/constants/message";

const OwlCarousel = dynamic(() => import('react-owl-carousel'), { ssr: false });

export default function Detail({ params }: { params: { uuid: any } }) {
  const [response, setResponse] = useState<any>(null);
  const uuid = params.uuid;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const serviceName = apiConfig.field.serviceName;
        const signatureKey = apiConfig.field.signatureKey;
        const unixTimestamp = Math.floor(Date.now() / 1000);
        const validateKey = `${serviceName}:${signatureKey}:${unixTimestamp}`;
        const hash = crypto.createHash('sha256').update(validateKey);
        const apiKey = hash.digest('hex');

        const response = await axios.get(`${apiConfig.field.baseUrl}/api/v1/field/${uuid}`, {
          headers: {
            "x-service-name": serviceName,
            "x-request-at": unixTimestamp.toString(),
            "x-api-key": apiKey,
          },
        });
        setResponse(response.data.data);
      } catch (error: any) {
        if (error.code === 'ERR_NETWORK') {
          toast.error(message.general.ERR_NETWORK);
        } else {
          toast.error(error.response?.data?.message || "An error occurred");
        }
      }
    };

    if (response === null) {
      fetchData();
    }
  }, [response, uuid]); // Tambahkan uuid ke dependency array

  const options = {
    loop: true,
    margin: 10,
    autoplay: true,
    smartSpeed: 700,
    nav: false,
    dots: true,
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      800: { items: 1 },
      1000: { items: 1 },
      1100: { items: 1 },
    },
  };

  return (
    <>
      <div className="untree_co-section">
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <OwlCarousel className="owl-single dots-absolute owl-carousel" {...options}>
                {response?.images?.length > 0 ? (
                  response.images.map((image: string, index: number) => (
                    <div className="item" key={index}>
                      <img
                        src={image}
                        alt="Free HTML Template by Untree.co"
                        className="img-fluid rounded-20"
                      />
                    </div>
                  ))
                ) : (
                  <div className="item">
                    <p>No images available.</p>
                  </div>
                )}
              </OwlCarousel>
            </div>
            <div className="col-lg-5 pl-lg-5 ml-auto">
              <h2 className="section-title description poppins-bold">Keterangan</h2>
              <table className="table table-borderless poppins-medium">
                <tbody>
                <tr>
                  <td>Kode Lapangan</td>
                  <td>:</td>
                  <td>{response?.code}</td>
                </tr>
                <tr>
                  <td>Nama Lapangan</td>
                  <td>:</td>
                  <td>{response?.name}</td>
                </tr>
                <tr>
                  <td>Harga Per Jam</td>
                  <td>:</td>
                  <td>{response?.pricePerHour}</td>
                </tr>
                </tbody>
              </table>
              <h2 className="section-title mb-4 poppins-bold">Fasilitas</h2>
              <ul className="list-unstyled two-col clearfix poppins-medium">
                <li>Locker Room</li>
                <li>Wifi</li>
                <li>Bench Pemain</li>
                <li>Lampu Sorot LED</li>
                <li>Kantin</li>
                <li>Parkir Area</li>
                <li>Toilet</li>
                <li>Charging Room</li>
                <li>Mushola</li>
                <li>Tribun Penonton</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

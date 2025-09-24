'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import crypto from "crypto";
import {Hash} from "node:crypto";
import apiConfig from "@/config/api";
import Link from "next/link";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {message} from "@/constants/message";

export default function FieldList() {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const serviceName: string | undefined = apiConfig.field.serviceName;
        const signatureKey: string | undefined = apiConfig.field.signatureKey;
        const unixTimestamp: number = Math.floor(Date.now() / 1000);
        const validateKey: string = `${serviceName}:${signatureKey}:${unixTimestamp}`;
        const hash: Hash = crypto.createHash('sha256');
        hash.update(validateKey);
        const apiKey: string = hash.digest('hex');
        const response = await axios.get(`${apiConfig.field.baseUrl}/api/v1/field`, {
          headers: {
            "x-service-name": serviceName,
            "x-request-at": unixTimestamp.toString(),
            "x-api-key": apiKey,
          }
        });
        setFields(response.data.data);
      } catch (error: any) {
        if (error.code === 'ERR_NETWORK') {
          toast.error(message.general.ERR_NETWORK);
        } else {
          toast.error(error.response.data.message);
        }
      }
    };

    fetchFields();
  }, []);

  return (
    <>
      <div className="untree_co-section" id="field-list">
        <div className="container">
          <div className="row justify-content-center text-center mb-5">
            <div className="col-lg-6">
              <h2 className="section-title text-center mb-3 poppins-bold">
                Daftar Lapangan
              </h2>
              <p className="poppins-regular">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint
                nostrum aliquid illum eius distinctio voluptas dolorem ducimus
                quos modi qui.
              </p>
            </div>
          </div>
          <div className="row">
            {fields?.length > 0 ? (
              fields.map((field: any) => (
                <div key={field.uuid} className="col-6 col-sm-6 col-md-6 col-lg-3 mb-4 mb-lg-0">
                  <div className="card card-fieldlist border border-white">
                    <figure className="img-wrapper-fieldlist">
                      <img
                        src={field.images[0]}
                        alt={field.name}
                        className="img-cover"
                      />
                      <div className="hover-overlay">
                        <button className="btn btn-outline-white poppins-medium">
                          Lihat Jadwal
                        </button>
                      </div>
                    </figure>
                    <Link href={`booking/${field.uuid}`}>
                      <div className="meta-wrapper-fieldlist">
                        <h3 className="poppins-semibold">{field.name}</h3>
                        <span className="poppins-medium">
                        {field.pricePerHour}
                      </span>
                      </div>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <p className="text-center poppins-bold">Tidak ada lapangan yang tersedia.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

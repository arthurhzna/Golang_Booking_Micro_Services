'use client'
import Link from "next/link";
import React, {useContext, useEffect, useState} from "react";
import apiConfig from "@/config/api";
import {Hash} from "node:crypto";
import crypto from "crypto";
import axios from "axios";
import {toast} from "react-toastify";
import {AuthContext} from "@/context/AuthProvider";
import {message} from "@/constants/message";

export default function BookingList() {
  const {user} = useContext(AuthContext) as any;
  const [order, setOrder] = useState<any>([]);
  let userData = user;

  const getBookingData = async () => {
    try {
      const serviceName: string | undefined = apiConfig.order.serviceName;
      const signatureKey: string | undefined = apiConfig.order.signatureKey;
      const unixTimestamp: number = Math.floor(Date.now() / 1000);
      const validateKey: string = `${serviceName}:${signatureKey}:${unixTimestamp}`;
      const hash: Hash = crypto.createHash('sha256');
      hash.update(validateKey);
      const apiKey: string = hash.digest('hex');
      const response = await axios.get(`${apiConfig.order.baseUrl}/api/v1/order/user`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "x-service-name": serviceName,
          "x-request-at": unixTimestamp.toString(),
          "x-api-key": apiKey,
        },
      });
      const {data} = response.data;
      setOrder(data);
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK') {
        toast.error(message.general.ERR_NETWORK);
      } else {
        toast.error(error.response.data.message);
      }
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!userData) {
        const token: any = localStorage.getItem("authToken");
        const user: any = localStorage.getItem("userData");
        userData = { token, ...JSON.parse(user) }
      }
    }
    getBookingData()
  }, []);

  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped table-bordered" style={{width: '100%'}}>
          <thead>
          <tr className="text-center">
            <th scope="col">No</th>
            <th scope="col">Nomor Order</th>
            <th scope="col">Harga</th>
            <th scope="col">Tanggal Order</th>
            <th scope="col">Status</th>
            <th scope="col">Link Pembayaran</th>
            <th scope="col">Invoice</th>
          </tr>
          </thead>
          <tbody>
          {order?.length > 0 ? order.map((item: any, index: number) => (
            <tr className="text-center poppins-bold" key={index}>
              <th scope="row">{index + 1}</th>
              <td>{item.code}</td>
              <td>{item.amount}</td>
              <td>{item.orderDate}</td>
              <td>
                {item.status == 'payment-success' ? (
                  <h6>
                    <span className="badge badge-pill bg-success text-white">Pembayaran Berhasil</span>
                  </h6>
                ) : (
                  <h6>
                    <span className="badge badge-pill bg-warning text-white">Menunggu Pembayaran</span>
                  </h6>
                )}
              </td>
              <td>
                <Link href={item.paymentLink} style={{color: '#4758da' }} target="_blank">
                  <i className="fa fa-link"></i>
                  <span className="ml-2">Link Pembayaran</span>
                </Link>
              </td>
              <td>
                {item.invoiceLink ? (
                  <Link href={item.invoiceLink} style={{color: '#4758da' }} target="_blank">
                    <i className="fa fa-download"></i>
                    <span className="ml-2">Download</span>
                  </Link>
                ) : (
                  <h6><span className="badge badge-pill bg-danger text-white">Belum Tersedia</span></h6>
                )}
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={7} className="text-center">Belum ada data</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </>
  );
}
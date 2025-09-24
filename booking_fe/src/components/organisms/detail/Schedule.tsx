'use client'
import React, {useContext, useEffect, useState} from "react";
import moment from "moment/moment";
import apiConfig from "@/config/api";
import {Hash} from "node:crypto";
import crypto from "crypto";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {toast} from "react-toastify";
import {AuthContext} from "@/context/AuthProvider";
import {useRouter} from "next/navigation";
import Button from "@/components/atoms/Button";
import Swal from "sweetalert2";
import {status} from "@/constants/status";
import {message} from "@/constants/message";

export default function Schedule({params}: { params: { uuid: any } }) {
  const uuid = params.uuid
  const [today, setToday] = useState<Date | null>(new Date());
  const [cards, setCards] = useState<any>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<any>([]);
  const [isPayButtonVisible, setPayButtonVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const {user} = useContext(AuthContext) as any;

  const fetchData = async (selectedDate: any) => {
    try {
      const now: string = moment().format('YYYY-MM-DD');
      const serviceName: string | undefined = apiConfig.field.serviceName;
      const signatureKey: string | undefined = apiConfig.field.signatureKey;
      const unixTimestamp: number = Math.floor(Date.now() / 1000);
      const validateKey: string = `${serviceName}:${signatureKey}:${unixTimestamp}`;
      const hash: Hash = crypto.createHash('sha256');
      hash.update(validateKey);
      const apiKey: string | undefined = hash.digest('hex');
      const response = await axios.get(`${apiConfig.field.baseUrl}/api/v1/field/schedule/lists/${uuid}`, {
        headers: {
          "x-service-name": serviceName,
          "x-request-at": unixTimestamp.toString(),
          "x-api-key": apiKey,
        },
        params: {
          date: (selectedDate) ? selectedDate : now,
        },
      });
      const fetchedCards = response.data.data.map((item: any) => ({
        uuid: item.uuid,
        date: item.date,
        pricePerHour: item.pricePerHour,
        status: item.status,
        time: item.time,
        isSelected: false,
      }));

      setCards(fetchedCards);
    } catch (error: any) {
      if (error.code === 'ERR_NETWORK') {
        toast.error(message.general.ERR_NETWORK);
      } else {
        toast.error(error.response.data.message);
      }
    }
  };

  const calculateTotalPrice = (cards: any, selectedSchedule: any) => {
    return selectedSchedule
      .map((uuid: string) => {
        const card = cards.find((card: any) => card.uuid === uuid);
        return card ? convertToNumber(card.pricePerHour) : 0;
      })
      .reduce((total: number, price: number) => total + price, 0);
  }

  const convertToNumber = (rupiah: string) => {
    const numberString = rupiah.replace(/Rp\.|,/g, '').replace(/\./g, '');
    return parseInt(numberString, 10);
  }

  const formatToRupiah = (number: number) => {
    return `Rp.${number.toLocaleString('id-ID')}`;
  }

  useEffect(() => {
    const today: any = moment().format('YYYY-MM-DD');
    setToday(today);
    fetchData(null);
  }, []);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error('Anda harus login terlebih dahulu.');
      setTimeout(() => {
        router.push('/login');
      }, 2000)
    } else {
      setIsLoading(true);
      const serviceName: string | undefined = apiConfig.order.serviceName;
      const signatureKey: string | undefined = apiConfig.order.signatureKey;
      const unixTimestamp: number = Math.floor(Date.now() / 1000);
      const validateKey: string = `${serviceName}:${signatureKey}:${unixTimestamp}`;
      const hash: Hash = crypto.createHash('sha256');
      hash.update(validateKey);
      const apiKey: string | undefined = hash.digest('hex');
      const totalPrice = calculateTotalPrice(cards, selectedSchedule);
      Swal.fire({
        title: "Apakah Jadwal sudah sesuai?",
        html: `Total harganya adalah: <b>${formatToRupiah(totalPrice)}</b>`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes"
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.post(`${apiConfig.order.baseUrl}/api/v1/order`, {
            fieldScheduleIDs: selectedSchedule,
          }, {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "x-service-name": serviceName,
              "x-request-at": unixTimestamp.toString(),
              "x-api-key": apiKey,
            }
          }).then((response: any) => {
            setTimeout(() => {
              setIsLoading(false);
              router.push(response.data.data.paymentLink);
            }, 1000)
          }).catch((error: any) => {
            setIsLoading(false);
            const message = error.response.data[0].message;
            const replaceMessage = message.replace("FieldScheduleIDs", 'Field Schedule ID');
            toast.error(replaceMessage);
          });
        } else {
          setIsLoading(false);
        }
      });
    }
  }

  const toggleCardSelection = (index: any, uuid: any) => {
    const updatedCards: any = [...cards];
    const card = updatedCards[index];

    if (card.status !== status.BOOKED) {
      card.isSelected = !card.isSelected;

      if (card.isSelected) {
        setSelectedSchedule((prev: any) => [...prev, uuid]);
      } else {
        setSelectedSchedule((prev: any) => prev.filter((id: any) => id !== uuid));
      }

      const hasSelectedCard: boolean = updatedCards.some((card: any) => card.isSelected);
      setPayButtonVisible(hasSelectedCard);
    }

    setCards(updatedCards);
  };

  const handleDateChange = (date: Date | null) => {
    const newDate: any = moment(date).format('YYYY-MM-DD');
    setToday(newDate);
    setPayButtonVisible(false);
    fetchData(newDate);
  };

  return (
    <>
      <div className="untree_co-section">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-6 text-center">
              <h2 className="section-title mb-3 text-center poppins-bold">Jadwal Lapangan</h2>
              <p className="poppins-regular">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. A
                perspiciatis delectus nesciunt repudiandae neque asperiores
                pariatur, illo rem mollitia corporis.
              </p>
            </div>
          </div>
          <div className="desktop d-none d-lg-block">
            <div className="row">
              <div className="col-lg-3">
                <b>Pilih Tanggal</b>
                <DatePicker
                  selected={today}
                  minDate={new Date()}
                  onChange={handleDateChange}
                  dateFormat={"yyyy-MM-dd"}
                  className="form-control mt-1"
                  id="check-schedule"
                />
                <br/>
                <span className="text-danger poppins-regular" style={{fontSize: '11px'}}
                ><sup>*</sup>Tap kolom untuk booking</span
                >
              </div>
            </div>
            <br/>
            <div className="row">
              {cards?.length > 0 ? (
                cards.map((card: any, index: number) => (
                  <div className="col-lg-2 mt-3" key={index}>
                    <div
                      className={`card clickable-card ${card.isSelected ? 'selected' : ''} ${(card.status == status.BOOKED) ? 'booked' : ''}`}
                      style={{width: '11rem'}}
                      onClick={() => toggleCardSelection(index, card.uuid)}>
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <i
                            className={`fa-solid fa-xl ${card.isSelected || (card.status == status.BOOKED) ? 'fa-circle-minus' : 'fa-circle-plus'} icon`}></i>
                          <p className="mb-0 poppins-medium"><b>{card.date}</b></p>
                        </div>
                        <div className="mt-3">
                          <p className="text-center poppins-medium"><b>{card.time}</b></p>
                          <h5 className="text-center poppins-medium" style={{marginTop: '-12px'}}>
                            <b>{card.pricePerHour}</b>
                          </h5>
                          <p className="text-center status poppins-bold">{card.status}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-lg-12">
                  <div className="item text-center poppins-bold" style={{fontSize: '20px'}}>
                    <p>No schedule available.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="row mt-4 container-pay" style={{visibility: isPayButtonVisible ? 'visible' : 'hidden'}}>
              <div className="col-lg-12 fixed-bottom-btn d-flex align-items-center justify-content-center">
                <Button
                  type="button"
                  disabled={isLoading}
                  className="btn btn-pay poppins-bold w-100"
                  onClick={handleSubmit}
                >
                  {isLoading ? 'Loading...' : 'Lanjut Pembayaran'}
                </Button>
              </div>
            </div>
          </div>
          <div className="mobile d-sm-block d-lg-none">
            <div className="row">
              <div className="col-lg-12">
                <b>Pilih Tanggal</b>
                <br/>
                <DatePicker
                  selected={today}
                  minDate={new Date()}
                  onChange={handleDateChange}
                  dateFormat={"yyyy-MM-dd"}
                  className="form-control mt-1"
                  id="check-schedule"
                />
                <br/>
                <span className="text-danger" style={{fontSize: '11px'}}
                ><sup>*</sup>Tap kolom untuk booking</span
                >
              </div>
            </div>
            <div className="row mt-3" id="mobile-schedule">
              <div className="col-12">
                <div className="container">
                  <div className="row">
                    {cards?.length > 0 ? (
                      cards.map((card: any, index: number) => (
                        <div className="col-4 mt-4" key={index}>
                          <div className="team">
                            <div
                              className={`card clickable-card ${card.isSelected ? 'selected' : ''} ${(card.status == status.BOOKED) ? 'booked' : ''}`}
                              style={{width: '6rem'}}
                              onClick={() => toggleCardSelection(index, card.uuid)}
                            >
                              <div className="card-schedule">
                                <div className="mt-3">
                                  <p className="text-center time">
                                    <b>{card.time}</b>
                                  </p>
                                  <p
                                    className="text-center status"
                                    style={{marginTop: '-15px'}}
                                  >
                                    {card.status}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-lg-12">
                        <div className="item text-center poppins-bold" style={{fontSize: '20px'}}>
                          <p>No schedule available.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-4 container-pay" style={{visibility: isPayButtonVisible ? 'visible' : 'hidden'}}>
            <div
              className="col-lg-12 fixed-bottom-btn d-flex align-items-center justify-content-center"
            >
              <Button
                type="button"
                disabled={isLoading}
                className="btn btn-pay poppins-bold w-100"
                onClick={handleSubmit}
              >
                {isLoading ? 'Loading...' : 'Lanjut Pembayaran'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
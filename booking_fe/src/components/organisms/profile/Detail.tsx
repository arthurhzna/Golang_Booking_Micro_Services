'use client'
import styles from "@/styles/Profile.module.css";
import FormGroup from "@/components/molecules/FormGroup";
import Button from "@/components/atoms/Button";
import React, {useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";
import apiConfig from "@/config/api";
import {toast} from "react-toastify";
import {Hash} from "node:crypto";
import crypto from "crypto";
import {AuthContext} from "@/context/AuthProvider";
import {message} from "@/constants/message";

const serviceName: string | undefined = apiConfig.user.serviceName;
const signatureKey: string | undefined = apiConfig.user.signatureKey;
const unixTimestamp: number = Math.floor(Date.now() / 1000);
const validateKey: string = `${serviceName}:${signatureKey}:${unixTimestamp}`;
const hash: Hash = crypto.createHash('sha256');
hash.update(validateKey);
const apiKey: string = hash.digest('hex');

export default function Detail() {
  const {user} = useContext(AuthContext) as any;
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
  let userData = user;

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setFieldError('username', e.target.value);
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setFieldError('password', e.target.value);
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setFieldError('name', e.target.value);
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setFieldError('email', e.target.value);
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
    setFieldError('phone_number', e.target.value);
  }

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setFieldError('confirm_password', e.target.value);
  }

  const validationConditions: { [key: string]: (value: string) => boolean } = {
    username: (value: string) => value.length >= 5,
    name: (value: string) => value.length >= 3,
    email: (value: string) => value.length >= 5,
    phone_number: (value: string) => value.length >= 9,
    password: (value: string) => value.length >= 8,
    confirm_password: (value: string) => value === password
  };

  const setFieldError = (fieldName: string, fieldValue: string) => {
    if (validationConditions[fieldName](fieldValue)) {
      const newErrors = {...errors};
      delete newErrors[fieldName];
      setErrors(newErrors);
    }
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    let data: object
    if (password != '') {
      data = {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        username: username,
        password: password,
        confirmPassword: confirmPassword,
      }
    } else {
      data = {
        name: name,
        email: email,
        phoneNumber: phoneNumber,
        username: username,
      }
    }
    await axios.put(`${apiConfig.user.baseUrl}/api/v1/auth/${userData.uuid}`, data, {
      headers: {
        Authorization: `Bearer ${userData.token}`,
        "x-service-name": serviceName,
        "x-request-at": unixTimestamp.toString(),
        "x-api-key": apiKey,
      },
    }).then(() => {
      setIsLoading(false);
      toast.success('Update data berhasil');
      router.push('/profile');
    }).catch((error: any) => {
      setIsLoading(false);
      toast.error(error.response.data.message);
      const newErrors: any = {};
      if (error.response.data.data != undefined) {
        error.response.data.data.forEach((err: any) => {
          newErrors[err.field] = err.message;
        });
        setErrors(newErrors)
      }
    });
  }

  const getProfile = async () => {
    try {
      const response = await axios.get(`${apiConfig.user.baseUrl}/api/v1/auth/user`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "x-service-name": serviceName,
          "x-request-at": unixTimestamp.toString(),
          "x-api-key": apiKey,
        },
      });
      const {data} = response.data;
      setName(data.name);
      setEmail(data.email);
      setPhoneNumber(data.phoneNumber);
      setUsername(data.username);
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

    getProfile()
  }, []);
  return (
    <>
      <div className="container">
        <div className="row gutters">
          <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
            <div className="card">
              <div className="card-body">
                <div className={`${styles['account-settings']}`}>
                  <div className={`${styles['user-profile']}`}>
                    <div className={`${styles['user-avatar']}`}>
                      <img
                        src="https://bootdey.com/img/Content/avatar/avatar4.png"
                        alt="Maxwell Admin"
                      />
                    </div>
                    <p className={`${styles['user-name']} poppins-bold`}>{name}</p>
                  </div>
                  <div className={`${styles['about']}`}>
                    <h5 className="poppins-bold" style={{color: 'black'}}>About</h5>
                    <p>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Natus dolorum explicabo voluptate maxime sit velit?
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
            <div className="card h-100">
              <div className="card-body">
                <div className="row gutters">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <h6 className="mb-2 text-primary poppins-bold">Data Pribadi</h6>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <FormGroup
                        value={name}
                        type="text"
                        name="name"
                        className={`form-control ${styles['form-input']}`}
                        placeholder="Masukan Nama"
                        label="Nama"
                        onChange={handleNameChange}
                        labelClassName="poppins-semibold"
                      />
                      {errors.Name ? <span className="text-xs text-danger ml-2">{errors.Name}</span> : null}
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <FormGroup
                        value={email}
                        type="text"
                        name="email"
                        className={`form-control ${styles['form-input']}`}
                        placeholder="Masukan Email"
                        label="Email"
                        onChange={handleEmailChange}
                        labelClassName="poppins-semibold"
                      />
                      {errors.Email ? <span className="text-xs text-danger ml-2">{errors.Email}</span> : null}
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <FormGroup
                        value={phoneNumber}
                        type="text"
                        name="phone_number"
                        className={`form-control ${styles['form-input']}`}
                        placeholder="Masukan No Hp."
                        label="No Hp."
                        onChange={handlePhoneNumberChange}
                        labelClassName="poppins-semibold"
                      />
                      {errors.PhoneNumber ?
                        <span className="text-xs text-danger ml-2">{errors.PhoneNumber}</span> : null}
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <FormGroup
                        value={username}
                        type="text"
                        name="username"
                        className={`form-control ${styles['form-input']}`}
                        placeholder="Masukan Username"
                        label="Username"
                        onChange={handleUsernameChange}
                        labelClassName="poppins-semibold"
                      />
                      {errors.Username ? <span className="text-xs text-danger ml-2">{errors.Username}</span> : null}
                    </div>
                  </div>
                </div>
                <div className="row gutters">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <h6 className="mt-3 mb-2 text-primary poppins-bold">Ganti Password</h6>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <FormGroup
                        type="password"
                        name="password"
                        className={`form-control ${styles['form-input']}`}
                        placeholder="Masukan Password"
                        label="Password"
                        onChange={handlePasswordChange}
                        labelClassName="poppins-semibold"
                      />
                      {errors.Password ? <span className="text-xs text-danger ml-2">{errors.Password}</span> : null}
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group">
                      <FormGroup
                        type="password"
                        name="confirm_password"
                        className={`form-control ${styles['form-input']}`}
                        placeholder="Masukan Konfirmasi Password"
                        label="Konfirmasi Password"
                        onChange={handleConfirmPasswordChange}
                        labelClassName="poppins-semibold"
                      />
                      {errors.ConfirmPassword ?
                        <span className="text-xs text-danger ml-2">{errors.ConfirmPassword}</span> : null}
                    </div>
                  </div>
                </div>
                <div className="row gutters">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="text-right">
                      <Button
                        disabled={isLoading}
                        type="button"
                        id="submit"
                        className="btn btn-primary poppins-semibold"
                        onClick={handleSubmit}
                      >
                        {isLoading ? 'Loading...' : 'Update'}
                      </Button>
                    </div>
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
'use client'
import Link from "next/link";
import FormGroup from "@/components/molecules/FormGroup";
import Button from "@/components/atoms/Button";
import styles from "@/styles/Auth.module.css";
import React, {useContext, useState} from "react";
import axios from "axios";
import apiConfig from "@/config/api";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";
import {AuthContext} from "@/context/AuthProvider";
import Cookies from "js-cookie";

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
  const { setUser } = useContext(AuthContext) as any;

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setFieldError('username', e.target.value);
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setFieldError('password', e.target.value);
  }

  const validationConditions: { [key: string]: (value: string) => boolean } = {
    username: (value: string) => value.length >= 5,
    password: (value: string) => value.length >= 8,
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
    await axios.post(`${apiConfig.user.baseUrl}/api/v1/auth/login`, {
      username,
      password,
    }).then((response: any) => {
      const { token, data } = response.data;
      Cookies.set("authToken", token, { expires: 1 });
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(data));
      setUser({ token, ...data });
      setIsLoading(false);
      toast.success('Login berhasil');
      setTimeout(() => {
        router.push('/');
      }, 2000)
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

  return (
    <>
      <form method="post" className={`${styles['poppins-semibold']}`}>
        <div className="form-group first">
          <FormGroup
            type="text"
            name="username"
            className={`form-control ${styles['form-input']}`}
            placeholder="Masukan Username"
            label="Username"
            onChange={handleUsernameChange}
          />
          {errors.Username ? <span className="text-xs text-danger ml-2">{errors.Username}</span> : null}
        </div>
        <div className="form-group last mb-3">
          <FormGroup
            type="password"
            name="password"
            className={`form-control ${styles['form-input']}`}
            placeholder="Masukan Password"
            label="Password"
            onChange={handlePasswordChange}
          />
          {errors.Password ? <span className="text-xs text-danger ml-2">{errors.Password}</span> : null}
        </div>
        <Button
          disabled={isLoading}
          type="button"
          onClick={handleSubmit}
          className={`btn btn-block ${styles['btn-login']}`}
        >
          {isLoading ? 'Loading...' : 'Login'}
        </Button>
        <div className="d-flex mb-5 align-items-center mt-1">
          <span className="ml-auto">
            <Link
              href="/register"
              className={`${styles['forgot-pass']}`}
              style={{textDecoration: 'none'}}
            >
              Belum punya akun?
              <strong style={{textDecoration: 'underline', marginLeft: '5px'}}>
                Daftar disini
              </strong>
            </Link>
          </span>
        </div>
      </form>
    </>
  )
}
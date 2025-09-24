'use client'
import Link from "next/link";
import LoginForm from "@/components/organisms/login/LoginForm";
import styles from "@/styles/Auth.module.css";
import {useRouter} from "next/navigation";
import {useEffect} from "react";

export default function Login() {
  const router = useRouter()
  useEffect(() => {
    const user: string | null = localStorage.getItem('userData');
    if (user) {
      router.push('/');
    }
  }, [router]);

  return (
    <>
      <div className={`d-lg-flex ${styles['half']}`}>
        <div className={`${styles['bg']} order-1 order-md-2`}></div>
        <div className={`${styles['contents']}`}>
          <div className="container">
            <div className={`${styles['row-form']} row align-items-center justify-content-center`}>
              <div className={`col-md-7 ${styles['login-form']}`}>
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className={`${styles['poppins-bold']}`}>BWA Mini Soccer</h3>
                  <Link href="/">
                    <i className="fa-solid fa-house fa-xl" style={{color: '#D90E1E'}}></i>
                  </Link>
                </div>
                <LoginForm/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
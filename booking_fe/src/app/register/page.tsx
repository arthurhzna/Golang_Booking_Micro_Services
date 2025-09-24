import RegisterForm from "@/components/organisms/register/RegisterForm";
import Link from "next/link";
import styles from "@/styles/Auth.module.css";

export default function Register() {
  return (
    <>
      <div className={`d-lg-flex ${styles['half']}`}>
        <div className={`${styles['bg']} order-1 order-md-2`}></div>
        <div className={`${styles['contents']}`}>
          <div className="container">
            <div className={`${styles['row-form']} row align-items-center justify-content-center`}>
              <div className={`col-md-10 ${styles['register-form']}`}>
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className={`${styles['poppins-bold']}`}>BWA Mini Soccer</h3>
                  <Link href="/">
                    <i className="fa-solid fa-house fa-xl" style={{color: '#D90E1E'}}></i>
                  </Link>
                </div>
                <RegisterForm/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
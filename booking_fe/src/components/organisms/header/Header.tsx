'use client'
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import React, {useContext} from "react";
import {AuthContext} from "@/context/AuthProvider";

interface HeaderProps {
  color?: string
}
export default function Header(props: HeaderProps) {
  const { user, logout } = useContext(AuthContext) as any;
  let {color} = props;
  const currentPath = usePathname();
  const router = useRouter();

  if (color == undefined) {
    color = 'transparent';
  }

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    logout();
    router.push('/login');
  };

  return (
    <>
      <nav className="site-nav d-none d-lg-block" style={{ backgroundColor: `${color}` }}>
        <div className="container">
          <div className="site-navigation">
            <Link href="/" className="logo m-0"
            >Mini Soccer <span className="text-primary">.</span></Link>
            <ul
              className="js-clone-nav d-none d-lg-inline-block text-left site-menu float-right"
            >
              {currentPath === '/' ? (
                <>
                  <li className="active"><Link href="/">Beranda</Link></li>
                  <li><Link href="#facility">Fasilitas</Link></li>
                  <li><Link href="#gallery-list">Galeri</Link></li>
                  <li><Link href="#field-list">Lapangan</Link></li>
                </>
              ) : null}
              <li className="dropdown">
                <Link href="" title="RegisterForm" role="button" data-toggle="dropdown" aria-expanded="false">
                  <i className="fa-solid fa-circle-user fa-2xl text-white"></i>
                </Link>
                <div className="dropdown-menu">
                  {user ? (
                    <>
                      <Link className="dropdown-item" href="/profile">Profil</Link>
                      <Link className="dropdown-item" href="" onClick={handleLogout}>Logout</Link>
                    </>
                  ) : (
                    <>
                      <Link className="dropdown-item" href="/login">Login</Link>
                      <Link className="dropdown-item" href="/register">Register</Link>
                    </>
                  )}
                </div>
              </li>
            </ul>
            <Link
              href=""
              className="burger ml-auto float-right site-menu-toggle js-menu-toggle d-inline-block d-lg-none light"
              data-toggle="collapse"
              data-target="#main-navbar"
            >
              <span></span>
            </Link>
          </div>
        </div>
      </nav>

      <nav className="navbar navbar-expand-lg navbar-light d-lg-none d-sm-block bg-light">
        <Link href="/" className="logo-mobile m-0"
        >Mini Soccer <span className="text-secondary">.</span></Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul
            className="navbar-nav"
          >
            {currentPath === '/' ? (
              <>
                <li className="nav-item active"><Link className="nav-link" href="/">Beranda</Link></li>
                <li><Link className="nav-link" href="#facility">Fasilitas</Link></li>
                <li><Link className="nav-link" href="#gallery-list">Galeri</Link></li>
                <li><Link className="nav-link" href="#field-list">Lapangan</Link></li>
              </>
            ) : null}
            <li>
              <Link href="/" title="RegisterForm" className="btn btn-login nav-link d-sm-block d-lg-none"
                    style={{color: 'white', marginTop: '10px'}}>
                RegisterForm
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}
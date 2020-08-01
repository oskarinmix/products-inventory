import React from "react";
import Logo from "./logo.svg";
import "./header.scss";
const Header = () => {
  return (
    <header>
      <img src={Logo} alt="Logo" />
      <h1>Sistema de Inventario de Productos</h1>
    </header>
  );
};

export default Header;

import React from "react";
import Style from './Home.module.css';
import avatar from '../assests/img/avatar.png'

function Home() {
  return (
    <section className={Style.home} id="home">
      <div className={Style.shape}></div>
      <div className={Style.texto}>
        <h1 className={Style.titulo}>
          Bem-vindo a Doce <span className={Style.titulo_span}>Livery!</span>
        </h1>
        <p className={Style.descricao}>
          A plataforma que conecta confeiteiros, entregadores e clientes para uma experiência única e deliciosa.
        </p>

        <div className={Style.login_button_1}>
          <button><a href="docelivery/home/Apresentacao-Projeto">Clique Aqui</a></button>
        </div>
      </div>

      <div className={Style.baner}>
        <img className={Style.confeiteira} src={avatar} width="900" height="900" alt="Banner" />
      </div>
    </section>
  );
}

export default Home;
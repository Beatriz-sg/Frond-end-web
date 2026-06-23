import React, { useState, useEffect } from 'react';
import StoreService from '../services/storeService';
import Style from './Lojas.module.css';

function Lojas() {
  const [lojas, setLojas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    StoreService.getStores()
      .then(data => setLojas(data || []))
      .catch(err => console.error('Erro ao carregar lojas:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className={Style.lojas}>
      <h2>Nossas Lojas Parceiras</h2>
      {loading ? (
        <p>Carregando lojas...</p>
      ) : (
        <div className={Style.lojasGrid}>
          {lojas.map(loja => (
            <div key={loja.id} className={Style.lojaCard}>
              <h3>{loja.nomeLoja}</h3>
              <p>{loja.categoria}</p>
              {loja.promocao && <span className={Style.promocao}>{loja.promocao}</span>}
              {loja.telefone && <p className={Style.telefone}>{loja.telefone}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Lojas;
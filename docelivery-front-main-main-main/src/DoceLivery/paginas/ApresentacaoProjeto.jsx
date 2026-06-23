import React from 'react';
import Styles from '../paginas/ApresentacaoProjeto.module.css' // Importa o arquivo CSS
import facebook from '../assests/img/facebook_icon.png'; 
import twitter from '../assests/img/twitter_icon.png';
import instagram from '../assests/img/instragam_icon.jpg'; // Note: mantido o nome do arquivo com typo 'instragam' conforme o disco

const PROJETO_DADOS = {
    titulo: "DoceLivery",
    subtitulo: "Conectando o sabor artesanal do Brasil.",
    missao: {
        icone: '💖', // Emojis substituem ícones externos para simplicidade
        texto: "Conectar confeitarias e clientes com praticidade e carinho, oferecendo uma vitrine digital que valoriza o sabor, a tradição e a qualidade artesanal dos doces e bolos, com entrega rápida e confiável."
    },
    visao: {
        icone: '✨',
        texto: "Ser a principal plataforma de doces e bolos artesanais do Brasil, promovendo pequenos empreendedores e levando doçura para o dia a dia das pessoas, em qualquer lugar e ocasião."
    },
    valores: [
        { icone: '🏆', texto: "Qualidade e excelência em todos os processos" },
        { icone: '🤝', texto: "Comprometimento com a satisfação do cliente" },
        { icone: '⏰', texto: "Pontualidade e responsabilidade nas entregas" },
        { icone: '🍰', texto: "Trabalho artesanal com ingredientes selecionados" },
        { icone: '⚖️', texto: "Ética, respeito e transparência" },
        { icone: '💡', texto: "Inovação com tradição" },
    ]
};

// --- COMPONENTE MVV ITEM (MAIS RICO) --- 

const MvvItem = ({ title, data }) => (
    <div className={`${Styles.mvv_item} ${title.toLowerCase()}`}>
        <h3 className={Styles.mvv_title}>
            {data.icone && <span className={Styles.mvv_icon}>{data.icone}</span>}
            {title}
        </h3>
        <p>{data.texto}</p>
    </div>
);

// --- COMPONENTE VALOR CARD (PARA LISTA) ---

const ValorCard = ({ icone, texto }) => (
    <div className={Styles.valor_card}>
        <span className={Styles.valor_icon}>{icone}</span>
        <p>{texto}</p>
    </div>
);


// --- COMPONENTE PRINCIPAL ---

function ApresentacaoProjeto() {
  const { titulo, subtitulo, missao, visao, valores } = PROJETO_DADOS;

  return (
    <div className={Styles.apresentacao_container}>

      {/* Seção Hero/Capa - COM GRADIENTE */}
      <header className={Styles.hero}>
        <div className={Styles.content_wrapper}>
            <h1>{titulo}</h1>
            <h2>{subtitulo}</h2>
        </div>
      </header>

      <main className={Styles.content_wrapper}>

        {/* Seção Como Funcionamos - COM DESTAQUE */}
        <section id="sobre-nos" className={`${Styles.section} ${Styles.como_funcionamos}`}>
          <h2 className={Styles.section_title}>A Nossa Missão: Como Funcionamos</h2>
          <p className={Styles.description_text}>
            Somos a ponte digital que une o talento das confeitarias artesanais brasileiras aos clientes que buscam doçura, tradição e qualidade. Nossa plataforma é construída com foco na **praticidade** e na **valorização** de cada doce e bolo, garantindo uma experiência de compra e entrega rápida e confiável.
          </p>
        </section>

        {/* Seção Missão e Visão - MAIS VISUAL */}
        <section id="missao-visao" className={`${Styles.section} ${Styles.missao_visao_grid}`}>
            
            <MvvItem title="Missão" data={missao} />
            <MvvItem title="Visão" data={visao} />
            
        </section>
        
        {/* Seção Valores - COM CARDS */}
        <section id="valores" className={`${Styles.section} ${Styles.valores_section}`}>
            <h2 className={Styles.section_title}>Nossos Pilares (Valores)</h2>
            <div className={Styles.valores_grid}>
                {valores.map((valor, index) => (
                    <ValorCard 
                        key={index}
                        icone={valor.icone}
                        texto={valor.texto}
                    />
                ))}
            </div>
        </section>

      </main>

      {/* Rodapé */}
      <footer>
        <div className={Styles.footer_content}>
          <p>&copy; 2025 DoceLivery - Todos os direitos reservados.</p>
        <div className={Styles.social_icons}>
                <a href="#"><img src={facebook} height="20" width="20" alt="Facebook" /></a>
                <a href="#"><img src={twitter} height="20" width="20" alt="Twitter" /></a>
                <a href="#"><img src={instagram} height="20" width="20" alt="Instagram" /></a>
                </div>
        </div>
      </footer>

    </div>
  );
}
export default ApresentacaoProjeto;
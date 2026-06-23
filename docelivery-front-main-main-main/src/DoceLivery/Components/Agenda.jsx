// src/components/Agenda.js

import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Agenda.module.css'; // Vamos criar este arquivo de estilo

// Configura o moment para usar o idioma e fuso horário local
moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const Agenda = () => {
    // Estado para armazenar as vagas do dia
    const [vagas, setVagas] = useState({});
    // Estado para o evento de agendamento (um dia específico)
    // eslint-disable-next-line no-unused-vars
    const [agendamento, setAgendamento] = useState(null);

    // Função para lidar com o clique em um dia
    const handleSelectSlot = (slotInfo) => {
        // Pega a data clicada e formata
        const dateStr = moment(slotInfo.start).format('YYYY-MM-DD');
        const numVagas = prompt(`Quantas vagas você tem para a data ${moment(slotInfo.start).format('DD/MM/YYYY')}?`);

        if (numVagas !== null && !isNaN(numVagas) && numVagas > 0) {
            setVagas(prevVagas => ({
                ...prevVagas,
                [dateStr]: parseInt(numVagas),
            }));
            alert(`Vagas para ${moment(slotInfo.start).format('DD/MM/YYYY')} salvas: ${numVagas}`);
        } else if (numVagas !== null) {
            alert('Por favor, insira um número válido.');
        }
    };

    // Função para renderizar os eventos na agenda
    const eventPropGetter = (event) => {
        // Estiliza o evento de acordo com a quantidade de vagas
        const numVagas = vagas[moment(event.start).format('YYYY-MM-DD')];
        if (numVagas) {
            let className = '';
            if (numVagas > 5) {
                className = 'vagas_altas'; // Mais de 5 vagas
            } else if (numVagas > 0) {
                className = 'vagas_baixas'; // De 1 a 5 vagas
            } else {
                className = 'vagas_esgotadas'; // 0 vagas
            }

            return {
                className: className,
            };
        }
        return {};
    };

    // Formata os dados de vagas para a visualização da agenda
    const events = Object.keys(vagas).map(date => ({
        title: `${vagas[date]} vagas`,
        start: new Date(date),
        end: new Date(date),
        allDay: true,
    }));

    return (
        <div className="agenda_container">
            <h2 className="agenda_title">Agenda e Controle de Vagas</h2>
            <div className="vagas_info">
                <p>Clique em um dia para definir o número de vagas para encomendas.</p>
                <p>Vagas: <span className="vagas_altas_cor">Mais de 5</span> | <span className="vagas_baixas_cor">De 1 a 5</span> | <span className="vagas_esgotadas_cor">Esgotadas</span></p>
            </div>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 600 }}
                culture="pt-br"
                selectable
                onSelectSlot={handleSelectSlot}
                views={['month', 'week', 'day']}
                defaultView="week"
                messages={{
                    next: 'Próximo',
                    previous: 'Anterior',
                    today: 'Hoje',
                    month: 'Mês',
                    week: 'Semana',
                    day: 'Dia',
                    agenda: 'Agenda',
                    date: 'Data',
                    time: 'Hora',
                    event: 'Evento',
                    noEventsInRange: 'Nenhum evento no período.'
                }}
                eventPropGetter={eventPropGetter}
            />
        </div>
    );
};

export default Agenda;
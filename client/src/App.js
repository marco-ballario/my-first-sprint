import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Container, Row, Col, Table } from 'react-bootstrap';
import { useState, useEffect } from 'react';

import ServiceConfiguration from './components/ServiceConfiguration';
import CounterConfiguration from './components/CounterConfiguration';
import API from './API';

function App() {
  const [serviceList, setServiceList] = useState([]);
  const [dirty, setDirty] = useState(true);
  const [confStep, setConfStep] = useState(1);

  useEffect(() => {
    if(dirty){
      API.getServices()
        .then(services => {
          setServiceList(services);
          setDirty(false);
        })
        .catch(e => handleErrors(e));
    }
  }, [dirty]);

  const handleErrors = (err) => {
    console.log(err.error);
  }

  const deleteService = (service) => {
    if(!service.status){
      service.status = "deleted"
      API.deleteService(service)
        .then(() => setDirty(true))
        .catch(e => handleErrors(e))
    }
  }

  const addService = (service) => {
    service.status = "add";
    const id = Math.max(...serviceList.map( s => s.id )) + 1;
    setServiceList(oldList => [...oldList, { id: id, ...service }]);
    API.addService(service)
        .then(() => setDirty(true))
        .catch(e => handleErrors(e));
  }


  return (
    <Container className="App">
        {confStep==1 && <ServiceConfiguration serviceList={serviceList} onNext={()=>setConfStep(2)} onDelete={deleteService} onAdd={addService}></ServiceConfiguration>}
        {confStep==2 && <CounterConfiguration serviceList={serviceList} onBack={()=>setConfStep(1)}></CounterConfiguration>}
    </Container>

  );
}

export default App;

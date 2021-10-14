import { Row, Col, Table, Button, Form } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { useState } from 'react';

const ServiceConfiguration = (props) => {

    const { serviceList, onNext, onDelete, onAdd } = props;

    return (<>
        <Row>
            <Col md={{ span: 8, offset: 2 }}>
                <Row className="align-items-center">
                    <Col><h2>Configure Services</h2></Col>
                    <Col><h6 className="float-end">(step 1 of 2)</h6></Col>
                </Row>

            </Col>
        </Row>
        <Row>
            <Col md={{ span: 8, offset: 2 }}>
                <ServiceForm onAdd={onAdd}></ServiceForm>
                <ServiceTable serviceList={serviceList} onDelete={onDelete}></ServiceTable>
                <Row >
                    <Col xs={{ span: 2, offset: 0 }}>
                        <Button className="mb-4" variant='primary'>Exit</Button>
                    </Col>
                    <Col xs={{ span: 2, offset: 8 }} >
                        <Button className="mb-4 float-end" variant='primary' onClick={onNext}>Next</Button>
                    </Col>
                </Row>

            </Col>
        </Row>
    </>
    );
}

const ServiceForm = (props) => {

    const { onAdd } = props;

    const [name, setName] = useState("");
    const [time, setTime] = useState(5);

    const [validated, setValidated] = useState(false);


    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        
      
        // check if form is valid using HTML constraints
        if (!form.checkValidity()) {
            setValidated(true); // enables bootstrap validation error report
        } else {
        // we must re-compose the service object from its separated fields
        const newService = Object.assign({}, { name, time });
        onAdd(newService);
        }
    }



    return (
        <>
            <Col xs={{ span: 6, offset: 3 }}>
                <h5 className="text-center mb-0">Add new service</h5>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-2" controlId='form-name'>
                        <Form.Label>Service name</Form.Label>
                        <Form.Control type="text" name="name" placeholder="Enter service name" value={name}
                            onChange={(ev) => setName(ev.target.value)} required autoFocus />
                        <Form.Control.Feedback type="invalid">
                            Please provide a service name.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId='form-time'>
                        <Form.Label>Average time (minutes)</Form.Label>
                        <Form.Control type='number' name="time" min={1} max={1440} value={time}
                        onChange={(ev) => setTime(ev.target.value)} required autoFocus />
                    </Form.Group>
                    <Col md={{ span: 1, offset: 5 }}>
                        <Button className="mb-4" variant='success' type="submit">Add</Button>
                    </Col>
                </Form>
            </Col>
        </>
    );
}

const ServiceTable = (props) => {

    const { serviceList, onDelete } = props;

    return (<>
        <h5 className="text-center">Existing services</h5>
        <Table responsive striped bordered>
            <thead>
                <tr>
                    <th className="col-3">Service name</th>
                    <th className="col-1">Average time</th>
                    <th className="col-1">Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    serviceList.map(s => {
                        return (
                            <tr>
                                <td>{s.name}</td>
                                <td>{s.time}</td>
                                <td className={"text-center"}><Button disabled={s.status} variant="danger" className="shadow-none" onClick={() => onDelete(s)}><Trash/></Button>
                                </td>
                            </tr>
                        );
                    })
                }
            </tbody>
        </Table>
    </>
    );

}

export default ServiceConfiguration;
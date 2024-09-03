import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Store } from '../Store.js';
import CheckoutSteps from "../components/CheckoutSteps.js";

export default function ShippingAddressScreen() {
    const navigate=useNavigate();
    const{state, dispatch:ctxDispatch}=useContext(Store);

    const{
        userInfo,
        cart:{shippingAddress},
    }=state;

    const [fullName, setFullName] = useState(shippingAddress.fullName || '');
    const [telephone, setTelephone] = useState(shippingAddress.telephone || '');
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');

    useEffect(()=>{
        if(!userInfo){
            navigate('/signin?redirect=/shipping');
        }
    },[userInfo,navigate]);

    const submitHandler = (e) => {
        e.preventDefault();
        ctxDispatch({
            type:'SAVE_SHIPPING_ADDRESS',
            payload:{
                fullName,
                telephone,
                address,
                city,
                postalCode,
            },
        });
        localStorage.setItem(
            'shippingAddress',
            JSON.stringify({
                fullName,
                telephone,
                address,
                city,
                postalCode,
            })
        );
        navigate('/payment');
    }

    return (
        <div>
            <Helmet>
                <title>收货地址</title>
            </Helmet>

            <CheckoutSteps step1 step2></CheckoutSteps>
            <div className="container small-container">
                <h1 className="my-3">收货地址</h1>
                <Form onSubmit={submitHandler}>
                    <Form.Group className="mb-3" controlId="fullName">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="telephone">
                        <Form.Label>Telephone</Form.Label>
                        <Form.Control
                            value={telephone}
                            onChange={(e) => setTelephone(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                            value={address}
                            onChange={(e => setAddress(e.target.value))}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="city">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                            value={city}
                            onChange={(e => setCity(e.target.value))}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="postalCode">
                        <Form.Label>Postal Code</Form.Label>
                        <Form.Control
                            value={postalCode}
                            onChange={(e => setPostalCode(e.target.value))}
                            required
                        />
                    </Form.Group>

                    <div className="mb-3">
                        <Button variant="primary" type="submit">
                            Continue
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    )
}
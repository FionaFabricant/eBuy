import React, { useContext, useEffect, useState } from "react";
import CheckoutSteps from "../components/CheckoutSteps";
import { Helmet } from "react-helmet-async";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Store } from "../Store";
import { useNavigate } from "react-router-dom";


export default function PaymentMethodScreen() {

    const{state, dispatch:ctxDispatch}=useContext(Store);

    const navigate=useNavigate();

    const{
        cart:{shippingAddress,paymentMethod},
    }=state;

    const [paymentMethodName,setPaymentMethod]=useState(paymentMethod || 'Paypal');

    useEffect(()=>{
        if(!shippingAddress.address){
            navigate('/shipping');
        }
    },[shippingAddress,navigate]);

    const submitHandler=(e)=>{
        e.preventDefault();
        ctxDispatch({type:'SAVE_PAYMENT_METHOD',payload:paymentMethodName});
        localStorage.setItem('paymentMethod',paymentMethodName);
        navigate('/placeorder');
    }

    return (
    <div>
        <CheckoutSteps step1 step2 step3></CheckoutSteps>
        <div className="container small-container">

        <Helmet>
            <title>Payment Method</title>
        </Helmet>
        <h1 className="my-3">Payment Method</h1>

        <Form onSubmit={submitHandler}>
            <div className="mb-3">
                <Form.Check
                type="radio"
                id="Paypal"
                label="Paypal"
                value="Paypal"
                checked={paymentMethodName==='Paypal'}
                onChange={(e)=>setPaymentMethod(e.target.value)}
                />  
            </div>

            <div className="mb-3">
                <Form.Check
                type="radio"
                id="Alipay"
                label="Alipay"
                value="Alipay"
                checked={paymentMethodName==='Alipay'}
                onChange={(e)=>setPaymentMethod(e.target.value)}
                />  
            </div>

            <div className="mb-3">
                <Button type="submit">Continue</Button>
            </div>

        </Form>
        </div>
    </div>
    )
}
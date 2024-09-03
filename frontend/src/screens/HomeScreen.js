import { useEffect, useReducer, useState } from "react";
import axios from "axios";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Product from "../components/Product";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Carousel from "react-bootstrap/Carousel";

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, products: action.payload, loading: false }
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

function HomeScreen() {
    const [{ loading, error, products }, dispatch] = useReducer(reducer, {
        products: [],
        loading: true,
        error: '',
    });

    const [selectedCategory, setSelectedCategory] = useState('All');

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: "FETCH_REQUEST" });
            try {
                const result = await axios.get('/api/products')
                dispatch({ type: "FETCH_SUCCESS", payload: result.data });
            } catch (err) {
                dispatch({ type: "FETCH_FAIL", payload: err.message });
            }
        };
        fetchData();
    }, []);

    const categories = ['All', ...new Set(products.map(product => product.category))];

    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(product => product.category === selectedCategory);

    return (
        <div>
            <Helmet>
                <title>eBuy</title>
            </Helmet>

            <Nav className="flex-row navbar-bg w-100 p-2" >

                {categories.map((category) => (
                    <Nav.Item key={category}>
                        <Nav.Link onClick={() => setSelectedCategory(category)}>
                            {category}
                        </Nav.Link>
                    </Nav.Item>
                ))}
            </Nav>

            <Carousel className="mt-3">
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/images/carousel1.jpg"
                        alt="First slide"
                    />
                    <Carousel.Caption>
                    </Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/images/carousel2.jpg"
                        alt="Second slide"
                    />
                    <Carousel.Caption>
                    </Carousel.Caption>
                </Carousel.Item>
                
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="/images/carousel3.jpg"
                        alt="Third slide"
                    />
                    <Carousel.Caption>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>


            <h1>Top Selling</h1>

            <div className="products">
                {
                    loading ? (
                        <LoadingBox />
                    )
                        : error ? (
                            <MessageBox variant="danger">{error}</MessageBox>
                        ) : (
                            <Row>
                                {filteredProducts.map(product => (
                                    <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                                        <Product product={product}></Product>
                                    </Col>
                                ))}
                            </Row>
                        )
                }
            </div>
        </div>
    )
}

export default HomeScreen;
